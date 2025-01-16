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

const getOrdersByUserId = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}`, userId);
    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error.message);
  }
};

const getOrdersByStoreId = async (storeId) => {
  try {
    const response = await axios.get(baseUrl, storeId);
    return response.data;
  } catch (error) {
    console.error("Error getting orders", error.message);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${baseUrl}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error changing status", error.message);
  }
};

export default {
  getOrder,
  getOrdersByUserId,
  getOrdersByStoreId,
  updateOrderStatus,
};
