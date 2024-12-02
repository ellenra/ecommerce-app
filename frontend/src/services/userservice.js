import axios from "axios";

const baseUrl = "http://localhost:5000/api/users/";

const register = async (data) => {
  console.log("Sending data to backend:", data);
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      data
    );
    console.log("User registered:", response.data);
  } catch (error) {
    console.error("Error in register:", error.message);
  }
};

const getUser = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching user:", error.message);
  }
};

const addProductToFavorites = async (productId, userId) => {
  try {
    const response = await axios.post(`${baseUrl}${userId}/favorites`, {
      productId,
    });
    return response;
  } catch (error) {
    console.error("Error adding to favorites", error.message);
  }
};

const deleteProductFromFavorites = async (productId, userId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}${userId}/favorites/${productId}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting from favs", error.message);
  }
};

export default {
  register,
  getUser,
  addProductToFavorites,
  deleteProductFromFavorites,
};
