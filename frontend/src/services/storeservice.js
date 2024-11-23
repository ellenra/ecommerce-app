import axios from "axios";

const baseUrl = "http://localhost:5000/api/stores";

const createStore = async (data) => {
  try {
    const response = await axios.post(baseUrl, data);
    return response.data;
  } catch (error) {
    console.error("Error creating store", error.message);
  }
};

export default { createStore };
