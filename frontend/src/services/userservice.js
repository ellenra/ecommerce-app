import axios from "axios";

const baseUrl = "http://localhost:5000/api/auth/register";

const register = async (data) => {
  console.log("Sending data to backend:", data);
  try {
    const response = await axios.post(baseUrl, data);
    console.log("User registered:", response.data);
  } catch (error) {
    console.error("Error in register:", error.message);
  }
};

export default { register };
