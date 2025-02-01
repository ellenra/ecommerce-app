import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const StoreOwnerProductsPage = ({ store }) => {
  const navigate = useNavigate();

  if (!store) {
    return <div>No store found.</div>;
  }

  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-6 mt-10">
      {store.products.map((product) => (
        <Card
          key={product.id}
          shadow="sm"
          className="hover:shadow-lg rounded-lg bg-white"
        >
          <CardBody
            onClick={() => {
              navigate(`/stores/${product.storeId}/products/${product.id}`, {
                state: { from: `/stores/${store.id}/products` },
              });
            }}
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
            onClick={() => {
              navigate(`/stores/${product.storeId}/products/${product.id}`, {
                state: { from: `/stores/${store.id}/products` },
              });
            }}
          >
            <b>{product.name}</b>
            <div className="flex items-center">
              <p>{product.price} $</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StoreOwnerProductsPage;
