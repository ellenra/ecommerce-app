import axios from "axios";

const baseUrl = "http://localhost:5000/api/products";

const getProducts = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error getting products:", error.message);
  }
};

const getProductCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error.message);
  }
};

export default {
  getProducts,
  getProductCategories,
};
