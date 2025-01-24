import axios from "axios";

const baseUrl = "http://localhost:5000/api/stores/";

const createStore = async (data, accessToken) => {
  try {
    const response = await axios.post(baseUrl, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating store", error.message);
  }
};

const getStore = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching store:", error.message);
  }
};

const updateStore = async (storeId, data, accessToken) => {
  try {
    const response = await axios.put(`${baseUrl}${storeId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating store", error.message);
  }
};

const listProduct = async (data, accessToken) => {
  try {
    const response = await axios.post(
      `${baseUrl}${data.get("storeId")}/products`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error listing product:", error.message);
  }
};

const getProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/:storeId/products/${productId}`,
      productId
    );
    return response.data;
  } catch (error) {
    console.error("Error getting product:", error.message);
  }
};

const deleteProduct = async (productId, storeId, accessToken) => {
  try {
    const response = await axios.delete(
      `${baseUrl}${storeId}/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error.message);
  }
};

const updateProduct = async (data, accessToken) => {
  try {
    const response = await axios.put(
      `${baseUrl}${data.get("storeId")}/products/${data.get("productId")}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product data:", error.message);
  }
};

export default {
  createStore,
  getStore,
  updateStore,
  listProduct,
  getProduct,
  deleteProduct,
  updateProduct,
};
