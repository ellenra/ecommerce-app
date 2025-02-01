import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/favoriteProducts";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import productservice from "../services/productservice";

const ViewProducts = () => {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    label: "All Categories",
    value: "",
  });
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");
  const categoryQuery = new URLSearchParams(location.search).get("category");

  const navigate = useNavigate();
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      try {
        const fetchedUser = await userservice.getUser(
          session.user.id,
          session.access_token
        );
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await productservice.getProductCategories();
        setCategories(
          categories.map((cat) => ({ value: cat.id, label: cat.name }))
        );
      } catch (error) {
        console.error("Error fetching categories", error.message);
      }
    };

    fetchCategories();
    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (categoryQuery && selectedCategory.value !== categoryQuery) {
      const category = categories.find((cat) => cat.value === categoryQuery);

      if (category) {
        setSelectedCategory(category);
      }
    }

    const fetchProducts = async () => {
      try {
        const url = `http://localhost:5000/api/products?category=${
          selectedCategory.value
        }&search=${searchQuery || ""}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, categoryQuery]);

  return (
    <div className="p-8">
      {categoryQuery && (
        <p className="mb-10">
          {`Categories / ${
            categories.find((cat) => cat.value === categoryQuery)?.label
          }`}
        </p>
      )}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              shadow="sm"
              className="hover:shadow-lg rounded-lg bg-white"
            >
              <CardBody
                onClick={() =>
                  navigate(
                    `/stores/${product.storeId}/products/${product.id}`,
                    {
                      state: { from: "/products" },
                    }
                  )
                }
                className="p-0 hover:cursor-pointer"
              >
                <Image
                  alt={product.name}
                  src={product.imageUrl}
                  height={200}
                  width={200}
                  className="object-cover"
                />
              </CardBody>
              <CardFooter
                className="text-small justify-between hover:cursor-pointer"
                onClick={() =>
                  navigate(
                    `/stores/${product.storeId}/products/${product.id}`,
                    {
                      state: { from: "/products" },
                    }
                  )
                }
              >
                <b>{product.name}</b>
                <div className="flex items-center">
                  <p>{product.price} $</p>
                  {isFavorite(product.id) ? (
                    <Button
                      size="sm"
                      isIconOnly
                      onClick={() =>
                        deleteFavorite(product.id, session.access_token)
                      }
                    >
                      <FavoriteIcon fontSize="small" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      isIconOnly
                      onClick={() =>
                        addFavorite(product.id, session?.access_token)
                      }
                    >
                      <FavoriteBorderIcon fontSize="small" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
