import axios from "axios";

const baseUrl = process.env.API_URL;

const addToCart = async (data, accessToken) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/cart/${data.get("storeId")}/products`,
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
