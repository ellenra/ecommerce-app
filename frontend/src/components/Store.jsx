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
      <h1>{store.name}</h1>
      <p>{store.description}</p>
      <p>Category: {store.category}</p>
      {store.products.map((product, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => navigate(`/stores/${product.id}`)}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={product.name}
              className="w-full object-cover h-[140px]"
              src={product.imageUrl}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{product.name}</b>
            <p className="text-default-500">{product.description}</p>{" "}
          </CardFooter>
        </Card>
      ))}

      {isOwner && (
        <>
          <Link to={`/stores/${storeId}/products/new`}>
            <Button>List new product</Button>
          </Link>
          <Link to={`/stores/${storeId}/manage`}>
            <button>Manage Your Store</button>
          </Link>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Store;
