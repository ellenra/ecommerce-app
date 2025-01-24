import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import axios from "axios";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import productservice from "../services/productservice";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";
import { useFavorites } from "../hooks/favoriteProducts";

const Home = () => {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session.user) return;

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

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productservice.getProducts();
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stores");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
      }
    };

    fetchProducts();
    fetchStores();
  }, []);

  return (
    <div>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold">lakdmlsfpoamd</h1>
        <p className="mt-4 text-lg">Nice text</p>
        <Button className="mt-6" onClick={() => navigate("/stores")}>
          Shop Now
        </Button>
      </div>

      <div className="px-10">
        <h2 className="mb-4">Top Products</h2>
        <div className="flex overflow-x-scroll scrollbar-thin scrollbar-thumb-zinc-100 scrollbar-track-transparent gap-6 pb-4">
          {products.map((product, index) => (
            <Card
              key={index}
              className="min-w-[200px] shadow-md rounded-lg hover:shadow-xl"
            >
              <CardBody
                className="p-0 hover:cursor-pointer"
                onClick={() =>
                  navigate(`/stores/${product.storeId}/products/${product.id}`)
                }
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width="200px"
                  height="200px"
                />
              </CardBody>
              <CardFooter
                className="flex flex-row justify-between hover:cursor-pointer"
                onClick={() =>
                  navigate(`/stores/${product.storeId}/products/${product.id}`)
                }
              >
                <p>{product.name}</p>
                <p>{product.price} €</p>
              </CardFooter>
              <div className="flex justify-end -mr-3">
                {isFavorite(product.id) ? (
                  <Button
                    onClick={() =>
                      deleteFavorite(product.id, session.access_token)
                    }
                  >
                    <FavoriteIcon />
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      addFavorite(product.id, session.access_token)
                    }
                  >
                    <FavoriteBorderIcon />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 py-10 px-10 bg-zinc-100 rounded-lg mb-10">
        <h2 className="mb-4">Top Stores</h2>
        <div className="grid grid-cols-3 gap-6 mb-6">
          {stores.map((store, index) => (
            <Card
              key={index}
              isPressable
              className="bg-white shadow-md rounded-lg"
              onPress={() => navigate(`/stores/${store.id}`)}
            >
              <CardBody className="p-4">
                <h3>{store.name}</h3>
                <p className="text-sm text-gray-500">{store.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
