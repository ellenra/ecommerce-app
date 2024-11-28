import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import productService from "../services/productservice";
import { useCart } from "../CartContext";

const Product = () => {
  const { storeId, productId } = useParams();
  const user = useUser();
  const [product, setProduct] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addToCart } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProduct(productId, storeId);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const isOwner = user && user.id === product.userId;

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId, storeId);
      onOpenChange(false);
      navigate(`/stores/${storeId}`);
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <div className="flex">
      <div className="p-10">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-lg mt-2">{product.description}</p>
        <p className="text-lg mt-2">{product.price} €</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-8 gap-6 p-6">
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
        <Button onClick={addToCart(product)}>Add to cart</Button>
        {isOwner && (
          <>
            <div>
              <Button
                onPress={onOpen}
                className="hover:bg-gray-100 rounded-lg size-0"
              >
                Delete
              </Button>
            </div>

            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              classNames={{
                backdrop: "bg-black/40",
                base: "bg-white rounded-lg",
                header: "pt-10",
                closeButton: "hover:bg-white/5 active:bg-white/10 border m-2",
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
                        Are you sure you want to delete this product from your
                        store?
                      </p>
                    </ModalHeader>
                    <ModalBody>
                      <p>This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button onPress={onClose}>Close</Button>
                      <Button onPress={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        )}
        {isOwner && (
          <div>
            <Link to={`/stores/${storeId}/products/${productId}/edit`}>
              <Button>Edit product info</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
