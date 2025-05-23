import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Image,
  Button,
  Input,
  CardHeader,
} from "@nextui-org/react";
import Select from "react-select";
import axios from "axios";
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
    <>
      <div className="container mx-auto text-center py-28 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Discover, Buy and Sell Digital Products Effortlessly
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Explore a wide variety of digital products from the best and most
          trusted creators.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[{ label: "All Categories", value: "" }, ...categories]}
            className="w-full sm:w-64"
            placeholder="Select a category"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              indicatorSeparator: () => null,
              control: (base) => ({
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
            className="border rounded-lg w-full sm:w-80"
          />
          <Button
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-8 py-3"
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
          className="mt-6 text-purple-600 border-purple-600 hover:bg-purple-50 rounded-lg px-6 py-2"
          onClick={() => navigate("/products")}
        >
          Browse All Products
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-vold text-gray-900">
            Popular Categories
          </h2>
          <Button
            onClick={() => navigate("/products")}
            className="text-purple-600 border-purple-600 hover:bg-purple-50 rounded-lg px-4 py-2"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => (
            <div
              key={category.value}
              className="group relative bg-white rounded-xl shadow hover:shadow:lg overflow-hidden"
            >
              <Card className="bg-gray-50 hover:cursor-pointer">
                <CardBody
                  onClick={() =>
                    navigate(`/products?category=${category.value}`)
                  }
                >
                  <Image
                    src={"../../mobile.png"}
                    alt={category.label}
                    className="object-cover rounded-xl"
                  />
                </CardBody>
                <CardHeader
                  onClick={() =>
                    navigate(`/products?category=${category.value}`)
                  }
                >
                  <p className="overflow-hidden text-ellipsis">
                    {category.label}
                  </p>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 py-10 px-10 bg-zinc-50 rounded-lg mb-10">
        <h2 className="mb-6 text-xl text-center">Top Stores</h2>
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
    </>
  );
};

export default Home;
