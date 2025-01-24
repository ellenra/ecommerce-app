import axios from "axios";

const baseUrl = "http://localhost:5000/api/orders";

const getOrder = async (orderId, accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting order:", error.message);
  }
};

const getOrdersByUserId = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error.message);
  }
};

const getOrdersByStoreId = async (storeId, accessToken) => {
  try {
    const response = await axios.get(baseUrl, {
      params: { storeId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting orders", error.message);
  }
};

const updateOrderStatus = async (orderId, status, accessToken) => {
  try {
    const response = await axios.put(
      `${baseUrl}/${orderId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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
