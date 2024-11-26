import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import productService from "../services/productservice";

const Store = () => {
  const { storeId } = useParams();
  const user = useUser();
  const [store, setStore] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const handleDeleteProduct = async (productId) => {
    try {
      const deleteProduct = await productService.deleteProduct(
        productId,
        storeId
      );
      onOpenChange(false);
      navigate(0);
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <div>
      <div className=" py-6 text-center">
        <h1 className="text-3xl font-bold">{store.name}</h1>
        <p className="text-lg mt-2">{store.description}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-8 gap-6 p-6">
        {store.products.map((product, index) => (
          <>
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
              <CardFooter className=" text-sm flex justify-between items-start">
                <p className="p-2.5">
                  {product.name} {product.price}
                </p>
              </CardFooter>
            </Card>
            {isOwner && (
              <>
                <Button
                  onPress={onOpen}
                  className="hover:bg-gray-100 rounded-lg size-0"
                >
                  Delete
                </Button>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  classNames={{
                    backdrop: "bg-black/40",
                    base: "bg-white",
                    header: "pt-10",
                    closeButton: "hover:bg-white/5 active:bg-white/10 border",
                  }}
                  motionProps={{
                    variants: {
                      enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          ease: "easeOut",
                        },
                      },
                      exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                          duration: 0.2,
                          ease: "easeIn",
                        },
                      },
                    },
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>
                          <p>
                            Are you sure you want to delete this product from
                            your store?
                          </p>
                        </ModalHeader>
                        <ModalBody>
                          <p>This action cannot be undone.</p>
                        </ModalBody>
                        <ModalFooter>
                          <Button onPress={onClose}>Close</Button>
                          <Button
                            onPress={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
            )}
          </>
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
