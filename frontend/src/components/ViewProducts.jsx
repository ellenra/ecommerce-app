import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/favoriteProducts";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Search from "./Search";

const ViewProducts = () => {
  const session = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    label: "All Categories",
    value: "",
  });
  const navigate = useNavigate();
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session.user) return;

      try {
        const fetchedUser = await userservice.getUser(session.user.id);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session.user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `http://localhost:5000/api/products?category=${selectedCategory.value}&search=${search}`;
        const response = await axios.get(url);
        setProducts(response.data.products);
        setCategories(
          response.data.categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, [selectedCategory, search]);

  return (
    <>
      <div className="flex items-center m-2 space-x-2">
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={[{ label: "All Categories", value: "" }, ...categories]}
          className="w-64"
          placeholder="Select a category"
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
        <Search setSearch={(search) => setSearch(search)} />
      </div>
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
                  navigate(`/stores/${product.storeId}/products/${product.id}`)
                }
                className="p-0"
              >
                <Image
                  alt={product.name}
                  src={product.imageUrl}
                  height={200}
                  width={200}
                  className="object-cover"
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{product.name}</b>
                <div className="flex items-center">
                  <p>{product.price} $</p>
                  {isFavorite(product.id) ? (
                    <Button
                      size="sm"
                      isIconOnly
                      onClick={() => deleteFavorite(product.id)}
                    >
                      <FavoriteIcon fontSize="small" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      isIconOnly
                      onClick={() => addFavorite(product.id)}
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
    </>
  );
};

export default ViewProducts;
