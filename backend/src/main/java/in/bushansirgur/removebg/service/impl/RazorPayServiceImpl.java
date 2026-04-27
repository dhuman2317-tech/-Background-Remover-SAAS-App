package in.bushansirgur.removebg.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import in.bushansirgur.removebg.dto.UserDTO;
import in.bushansirgur.removebg.entity.OrderEntity;
import in.bushansirgur.removebg.repository.OrderRepository;
import in.bushansirgur.removebg.service.RazorpayService;
import in.bushansirgur.removebg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorPayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}") // Fixed syntax
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}") // Fixed syntax
    private String razorpaySecret;

    private final OrderRepository orderRepository;
    private final UserService userService;

    @Override
    public Order createOrder(Double amount, String currency) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpaySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int)(amount * 100)); // Ensure integer for paisa
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
        return razorpayClient.orders.create(orderRequest);
    }

    @Override
    public Map<String, Object> verifyPayment(String razorpayOrderId) throws RazorpayException {
        Map<String, Object> returnValue = new HashMap<>();
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpaySecret);

        Order orderInfo = razorpayClient.orders.fetch(razorpayOrderId);

        // Fixed typo: "pais" -> "paid"
        if (orderInfo.get("status").toString().equalsIgnoreCase("paid")) {
            OrderEntity existingOrder = orderRepository.findByOrderId(razorpayOrderId)
                    .orElseThrow(() -> new RazorpayException("Order not found: " + razorpayOrderId));

            if (existingOrder.getPayment()) {
                returnValue.put("success", false);
                returnValue.put("message", "Payment already processed");
                return returnValue;
            }

            // Update user credits
            UserDTO userDTO = userService.getUserByClerkId(existingOrder.getClerkId());
            userDTO.setCredits(userDTO.getCredits() + existingOrder.getCredits());
            userService.saveUser(userDTO);

            // Mark order as paid
            existingOrder.setPayment(true);
            orderRepository.save(existingOrder);

            returnValue.put("success", true);
            returnValue.put("message", "Credits added successfully");
        } else {
            returnValue.put("success", false);
            returnValue.put("message", "Payment not completed");
        }
        return returnValue;
    }
}