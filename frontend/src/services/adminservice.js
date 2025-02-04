import axios from "axios";

const baseUrl = "http://localhost:5000/api/admin";

const checkAdmin = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/${userId}`);
    return response;
  } catch (error) {
    console.error("Error checking admin", error.message);
  }
};

export default {
  checkAdmin,
};
