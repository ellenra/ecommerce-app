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

const getStore = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching store:", error.message);
  }
};

const updateStore = async (storeId, data) => {
  try {
    console.log("data", data);
    const response = await axios.put(`${baseUrl}/${storeId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating store", error.message);
  }
};

export default { createStore, getStore, updateStore };
