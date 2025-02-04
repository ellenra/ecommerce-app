import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Input,
} from "@nextui-org/react";
import Select from "react-select";
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    label: "All Categories",
    value: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );
  const navigate = useNavigate();

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

    fetchUserData();
  }, [session]);

  useEffect(() => {
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

    const fetchProducts = async () => {
      try {
        const response = await productservice.getProducts();
        setProducts(response);
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

    fetchCategories();
    fetchProducts();
    fetchStores();
  }, []);

  return (
    <div>
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold">Discover Amazing Products</h1>
        <p className="mt-4 text-lg mb-14">
          Shop from many unique stores and sellers
        </p>

        <div className="max-w-2xl mx-auto flex gap-2">
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[{ label: "All Categories", value: "" }, ...categories]}
            className="w-64 mb-4"
            placeholder="Select a category"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              indicatorSeparator: () => null,
              control: (base, state) => ({
                ...base,
                borderColor: "e2e2e2",
                borderRadius: "6px",
                padding: "2px",
              }),
            }}
          />
          <Input
            isClearable
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={({ currentTarget: query }) => setSearchQuery(query.value)}
            className="border rounded-lg w-[300px] lg:w-[400px] bg-white h-3/4"
          />
          <Button
            className="border bg-zinc-50 border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
            onClick={() => {
              const query = searchQuery || "";
              const category = selectedCategory?.value || "";
              navigate(`/products?search=${query}&category=${category}`);
            }}
          >
            Search
          </Button>
        </div>

        <Button
          className="mt-4 border bg-zinc-50 border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
          onClick={() => navigate("/products")}
        >
          Browse All Products
        </Button>
      </div>

      <div className="px-10 py-6">
        <h2 className="mb-4 text-xl">Top Products</h2>
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
              <div className="absolute top-2 right-0 z-20">
                {session && isFavorite(product.id) ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      deleteFavorite(product.id, session.access_token)
                    }
                  >
                    <FavoriteIcon />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      addFavorite(product.id, session?.access_token)
                    }
                  >
                    <FavoriteBorderIcon />
                  </Button>
                )}
              </div>
              <CardFooter
                className="flex flex-row justify-between hover:cursor-pointer"
                onClick={() =>
                  navigate(`/stores/${product.storeId}/products/${product.id}`)
                }
              >
                <p>{product.name}</p>
                <p>{product.price} €</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 py-10 px-10 bg-zinc-50 rounded-lg mb-10">
        <h2 className="mb-4 text-xl">Top Stores</h2>
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
