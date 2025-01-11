import { useEffect, useState } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-6">
      {products.map((product) => (
        <Card
          key={product.id}
          isPressable
          className="hover:shadow-lg rounded-lg"
          onClick={() =>
            navigate(`/stores/${product.storeId}/products/${product.id}`)
          }
        >
          <CardBody className="flex items-center">
            <Image src={product.imageUrl} className="rounded-lg h-48 w-48" />
            <h3 className="text-lg mt-4">{product.name}</h3>
            <p>{product.description}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ViewProducts;
