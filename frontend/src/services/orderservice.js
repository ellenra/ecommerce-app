import axios from "axios";

const baseUrl = process.env.API_URL;

const getOrder = async (orderId, accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}/api/orders/${orderId}`, {
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
    const response = await axios.get(`${baseUrl}/api/orders/`, {
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
    const response = await axios.get(`${baseUrl}/api/orders/`, {
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
      `${baseUrl}/api/orders/${orderId}`,
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

const checkIfPurchased = async (userId, productId, accessToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/orders/order-item/${productId}`,
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error checking purchase", error.message);
  }
};

export default {
  getOrder,
  getOrdersByUserId,
  getOrdersByStoreId,
  updateOrderStatus,
  checkIfPurchased,
};
