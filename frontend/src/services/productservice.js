import axios from "axios";

const baseUrl = "http://localhost:5000/api/stores/";

const listProduct = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl}${data.get("storeId")}/products`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error listing product:", error.message);
  }
};

const getProduct = async (productId, storeId) => {
  try {
    const response = await axios.get(
      `${baseUrl}${storeId}/products/${productId}`,
      productId
    );
    return response.data;
  } catch (error) {
    console.error("Error getting product:", error.message);
  }
};

const deleteProduct = async (productId, storeId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}${storeId}/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error.message);
  }
};

const updateProduct = async (productId, storeId, data) => {
  try {
    console.log(data);
    const response = await axios.put(
      `${baseUrl}${storeId}/products/${productId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product data:", error.message);
  }
};

export default { listProduct, deleteProduct, getProduct, updateProduct };
