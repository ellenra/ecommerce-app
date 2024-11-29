import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import productService from "../services/productservice";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
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
              isPressable
              className="min-w-[200px] shadow-md rounded-lg"
              onPress={() =>
                navigate(`/stores/${product.storeId}/products/${product.id}`)
              }
            >
              <CardBody className="p-0">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width="200px"
                  height="200px"
                  objectFit="cover"
                />
              </CardBody>
              <CardFooter className="flex flex-row justify-between">
                <p>{product.name}</p>
                <p>{product.price} €</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 py-10 px-10 bg-zinc-100 rounded-lg">
        <h2 className="mb-4">Top Stores</h2>
        <div className="grid grid-cols-3 gap-6">
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
