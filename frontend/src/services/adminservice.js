import axios from "axios";

const baseUrl = process.env.API_URL;

const checkAdmin = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/admin${userId}`);
    return response;
  } catch (error) {
    console.error("Error checking admin", error.message);
  }
};

export default {
  checkAdmin,
};
