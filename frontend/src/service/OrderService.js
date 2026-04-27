import axios from 'axios';
import toast from "react-hot-toast";

export const placeOrder = async ({ planId, getToken, onSuccess, backendUrl }) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${backendUrl}/api/orders?planId=${planId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 201) {
            initializePayment({ order: response.data, getToken, onSuccess, backendUrl });
        }
    } catch (error) {
        console.error(error.message);
        toast.error("Failed to place order");
    }
};

const initializePayment = ({ order, getToken, onSuccess, backendUrl }) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Credit Payment",
        description: "Credit Payment",
        order_id: order.id,
        receipt: order.receipt,
        handler: async (paymentDetails) => {
            try {
                const token = await getToken();
                const response = await axios.post(`${backendUrl}/api/orders/verify`, paymentDetails, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 200) {
                    toast.success("Credits added");
                    onSuccess?.();
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
};