import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const Store = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`/api/stores/${storeId}`);
        setStore(response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStore();
  }, [storeId]);

  if (!store) {
    return <div>Loading...</div>;
  }

  const isOwner = user && user.id === store.userId;

  return (
    <div>
      <div className=" py-6 text-center">
        <h1 className="text-3xl font-bold">{store.name}</h1>
        <p className="text-lg mt-2">{store.description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 p-6">
        {store.products.map((product, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => navigate(`/stores/${product.id}`)}
            className="mx-auto"
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                alt={product.name}
                className="w-full object-cover h-[140px]"
                src={product.imageUrl}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </CardBody>
            <CardFooter className="p-4 text-sm flex justify-between items-start">
              <p>{product.name}</p>
              <p>{product.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isOwner && (
        <div className="flex justify-between gap-4 p-8">
          <Link to={`/stores/${storeId}/products/new`}>
            <Button>List new product</Button>
          </Link>
          <Link to={`/stores/${storeId}/edit`}>
            <Button>Manage Your Store</Button>
          </Link>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Store;
