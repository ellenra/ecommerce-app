import axios from "axios";

const baseUrl = "http://localhost:5000/api/stores/";

const listProduct = async (data) => {
  console.log("urlll", `${baseUrl}${data.storeId}/products`);
  try {
    const response = await axios.post(
      `${baseUrl}${data.storeId}/products`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error listing product:", error.message);
  }
};

export default { listProduct };
