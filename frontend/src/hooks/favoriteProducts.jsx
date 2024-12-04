import { useNavigate } from "react-router-dom";
import userservice from "../services/userservice";

export const useFavorites = (user, setUser) => {
  const navigate = useNavigate();

  const addFavorite = async (productId) => {
    if (user) {
      try {
        await userservice.addProductToFavorites(productId, user.id);
        const fetchedUser = await userservice.getUser(user.id);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error adding product to favorites", error.message);
      }
    } else {
      navigate("/login");
    }
  };

  const deleteFavorite = async (productId) => {
    try {
      await userservice.deleteProductFromFavorites(productId, user.id);
      const fetchedUser = await userservice.getUser(user.id);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error deleting product from favs", error.message);
    }
  };

  const isFavorite = (productId) => {
    return user?.favorites?.some((favorite) => favorite.id === productId);
  };

  return { addFavorite, deleteFavorite, isFavorite };
};
