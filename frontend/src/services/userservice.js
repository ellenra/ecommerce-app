import axios from "axios";

const baseUrl = "http://localhost:5000/api/users";

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

const getUser = async (userId, accessToken) => {
  try {
    if (accessToken) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(`${baseUrl}/${userId}`, config, {
        withCredentials: true,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error in fetching user:", error.message);
    throw Error;
  }
};

const addProductToFavorites = async (productId, userId) => {
  try {
    const response = await axios.post(`${baseUrl}/${userId}/favorites`, {
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
      `${baseUrl}/${userId}/favorites/${productId}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting from favs", error.message);
  }
};

const updateUser = async (userId, data) => {
  try {
    const response = await axios.put(`${baseUrl}/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error.message);
  }
};

export default {
  register,
  getUser,
  addProductToFavorites,
  deleteProductFromFavorites,
  updateUser,
};
