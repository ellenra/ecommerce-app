import axios from "axios";

const baseUrl = process.env.API_URL;

const getProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error getting products:", error.message);
  }
};

const getFilteredProducts = async (category, query) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/products?category=${category || ""}&search=${query || ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting products:", error.message);
  }
};

const getProductCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/products/categories`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error.message);
  }
};

const postReview = async (productId, data, accessToken) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/products/${productId}/reviews`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting review!", error.message);
  }
};

export default {
  getProducts,
  getFilteredProducts,
  getProductCategories,
  postReview,
};
