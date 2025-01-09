import axios from "axios";

const baseUrl = "http://localhost:5000/api/orders";

const getOrder = async (orderId) => {
  try {
    const response = await axios.get(`${baseUrl}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting order:", error.message);
  }
};

export default {
  getOrder,
};
