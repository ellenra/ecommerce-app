import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useCart } from "../hooks/CartContext";
import storeservice from "../services/storeservice";
import { useAuth } from "../hooks/AuthContext";
import { toast } from "react-toastify";

const Product = () => {
  const { storeId, productId } = useParams();
  const { session } = useAuth();
  const [product, setProduct] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addToCart } = useCart();
  const [isOwner, setIsOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await storeservice.getProduct(productId, storeId);
        setProduct(response);
        if (session && response) {
          setIsOwner(session.user.id === response.userId);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId, session]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await storeservice.deleteProduct(
        productId,
        storeId,
        session.access_token
      );
      onOpenChange(false);
      toast.success("Product deleted successfully!");
      navigate(`/stores/${storeId}`);
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Failed to delete product!");
    }
  };

  return (
    <>
      <Link
        href={`/stores/${storeId}`}
        className="ml-10 rounded px-4 py-2 hover:bg-gray-100 text-sm"
      >
        <KeyboardBackspaceIcon />
      </Link>
      <div className="flex justify-center items-center flex-row p-10 space-x-10">
        <div>
          <Image
            shadow="lg"
            radius="md"
            alt={product.name}
            className="object-cover w-full h-[400px] rounded-lg"
            src={product.imageUrl}
          />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-zinc-800">
            {product.name}
          </h1>
          <p className="text-lg mt-4 text-zinc-600">{product.description}</p>
          <p className="text-xl font-semibold mt-6 text-zinc-900">
            {product.price} €
          </p>

          <div className="mt-6 flex space-x-4">
            <Button
              color="gradient"
              onClick={() => addToCart(product)}
              className="w-full md:w-auto border border-zinc-200 rounded-lg py-2 text-sm hover:bg-zinc-100 hover:border-zinc-300"
            >
              Add to cart
            </Button>
          </div>

          {isOwner && (
            <div className="mt-20 space-y-4">
              <h3 className="text-xl font-medium text-gray-700">
                Product Management
              </h3>

              <Button
                onPress={onOpen}
                className="mr-4 border border-zinc-200 text-sm rounded-lg hover:border-red-600 hover:bg-zinc-100"
              >
                Delete Product
              </Button>

              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                  backdrop: "bg-black/50",
                  base: "bg-white p-8 rounded-lg shadow-xl",
                  header: "text-lg font-medium text-zinc-900",
                  closeButton: "text-zinc-600 hover:text-zinc-800",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>
                        Are you sure you want to delete this product from your
                        store?
                      </ModalHeader>
                      <ModalBody>This action cannot be undone.</ModalBody>
                      <ModalFooter>
                        <Button
                          onPress={onClose}
                          className="mr-3 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
                        >
                          Close
                        </Button>
                        <Button
                          onPress={() => handleDeleteProduct(product.id)}
                          className="border text-sm rounded-lg border-red-600 hover:bg-zinc-100 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <Link href={`/stores/${storeId}/products/${productId}/edit`}>
                <Button className="border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300">
                  Edit product info
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
