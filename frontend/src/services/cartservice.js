import axios from "axios";

const baseUrl = "http://localhost:5000/api/cart/";

const addToCart = async (data, accessToken) => {
  try {
    const response = await axios.post(
      `${baseUrl}${data.get("storeId")}/products`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error listing product:", error.message);
  }
};

export default { addToCart };
