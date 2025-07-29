import axios from "axios";

const baseUrl = process.env.API_URL;

const register = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/register`, data);
  } catch (error) {
    console.error("Error in register:", error.message);
  }
};

const getUser = async (userId, accessToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/users
/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in fetching user:", error.message);
    throw Error;
  }
};

const addProductToFavorites = async (productId, userId, accessToken) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/users/${userId}/favorites`,
      {
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding to favorites", error.message);
  }
};

const deleteProductFromFavorites = async (productId, userId, accessToken) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/users/${userId}/favorites/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting from favs", error.message);
  }
};

const updateUser = async (userId, data, accessToken) => {
  try {
    const response = await axios.put(`${baseUrl}/api/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
