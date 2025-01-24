import { useNavigate } from "react-router-dom";
import userservice from "../services/userservice";

export const useFavorites = (user, setUser) => {
  const navigate = useNavigate();

  const addFavorite = async (productId, accessToken) => {
    if (user) {
      try {
        await userservice.addProductToFavorites(
          productId,
          user.id,
          accessToken
        );
        const fetchedUser = await userservice.getUser(user.id, accessToken);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error adding product to favorites", error.message);
      }
    } else {
      navigate("/login");
    }
  };

  const deleteFavorite = async (productId, accessToken) => {
    try {
      await userservice.deleteProductFromFavorites(
        productId,
        user.id,
        accessToken
      );
      const fetchedUser = await userservice.getUser(user.id, accessToken);
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
