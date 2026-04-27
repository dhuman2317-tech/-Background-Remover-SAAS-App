package in.bushansirgur.removebg.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.bushansirgur.removebg.dto.UserDTO;
import in.bushansirgur.removebg.response.RemoveBgResponse;
import in.bushansirgur.removebg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    private final UserService userService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody String payload) {
        try {
            boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
            if (!isValid) {
                RemoveBgResponse response = RemoveBgResponse.builder()
                        .statusCode(HttpStatus.UNAUTHORIZED)
                        .data("Invalid webhook signature")
                        .success(false)
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(payload);
            String eventType = rootNode.path("type").asText();

            switch (eventType) {
                case "user.created":
                    handleUserCreated(rootNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(rootNode.path("data"));
                    break;
                case "user.deleted":
                    handleUserDeleted(rootNode.path("data"));
                    break;
            }
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            RemoveBgResponse response = RemoveBgResponse.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Something went wrong: " + e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String extractEmail(JsonNode data) {
        JsonNode emailAddresses = data.path("email_addresses");
        if (emailAddresses.isArray() && emailAddresses.size() > 0) {
            return emailAddresses.get(0).path("email_address").asText();
        }
        return "";
    }

    private void handleUserCreated(JsonNode data) {
        UserDTO userDTO = UserDTO.builder()
                .clerkId(data.path("id").asText())
                .email(extractEmail(data))
                .firstName(data.path("first_name").asText())
                .lastName(data.path("last_name").asText())
                .photoUrl(data.path("image_url").asText())
                .build();

        userService.saveUser(userDTO);
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.path("id").asText();
        UserDTO existingUser = userService.getUserByClerkId(clerkId);

        existingUser.setEmail(extractEmail(data));
        existingUser.setFirstName(data.path("first_name").asText());
        existingUser.setLastName(data.path("last_name").asText());
        existingUser.setPhotoUrl(data.path("image_url").asText());

        userService.saveUser(existingUser);
    }

    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.path("id").asText();
        userService.deleteUserByClerkId(clerkId);
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        return true;
    }
}
