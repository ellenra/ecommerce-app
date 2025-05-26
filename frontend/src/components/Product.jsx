import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderservice from "../services/orderservice";

const fetchProductById = async (productId, storeId) => {
  const response = await storeservice.getProduct(productId, storeId);
  return response;
};

const updateProductStatus = async ({ productId, storeId, accessToken }) => {
  const response = await storeservice.changeProductStatus(
    productId,
    storeId,
    accessToken
  );
  return response;
};

const checkIfPurchased = async (userId, productId, accessToken) => {
  const response = await orderservice.checkIfPurchased(
    userId,
    productId,
    accessToken
  );
  return response.hasPurchased;
};

const Product = () => {
  const { storeId, productId } = useParams();
  const { session } = useAuth();
  const {
    isOpen: isUnlistModalOpen,
    onOpen: onUnlistModalOpen,
    onClose: onUnlistModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const { addToCart } = useCart();
  const [isOwner, setIsOwner] = useState(false);
  const location = useLocation();
  const from = location.state?.from || "/";
  const statusFilter = location.state?.statusFilter;
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId, storeId),
    enabled: !!productId,
  });

  const { data: hasPurchased, isLoading: isCheckingPurchase } = useQuery({
    queryKey: ["hasPurchased", session?.user.id, productId],
    queryFn: () =>
      checkIfPurchased(session.user.id, productId, session.access_token),
    enabled: !!session?.user.id && !!productId,
  });

  useEffect(() => {
    if (session && product) {
      setIsOwner(session.user.id === product.userId);
    }
  }, [session, product]);

  useEffect(() => {});

  const mutation = useMutation({
    mutationFn: updateProductStatus,
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries(["product", productId]);
      const previousProduct = queryClient.getQueryData(["product", productId]);

      queryClient.setQueryData(["product", productId], (prevProduct) => ({
        ...prevProduct,
        isActive: newStatus.isActive,
      }));

      return { previousProduct };
    },
    onError: (context) => {
      queryClient.setQueryData(["product", productId], context.previousProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product", productId]);
    },
  });

  const handleProductStatusChange = async () => {
    mutation.mutate({
      productId,
      storeId,
      accessToken: session.access_token,
    });
    onUnlistModalClose();
    toast.success("Product status changed successfully!");
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await storeservice.deleteProduct(
        productId,
        storeId,
        session.access_token
      );

      if (response.error) {
        toast.error(response.error);
        onDeleteModalClose();
        return;
      }

      onDeleteModalClose();
      toast.success("Product deleted successfully!");
      navigate(`/stores/${storeId}`);
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Failed to delete product!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  return (
    <>
      <Button
        onClick={() => navigate(from, { state: { statusFilter } })}
        className="ml-10 mt-4 text-sm rounded-lg"
      >
        <KeyboardBackspaceIcon />
      </Button>
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
          {!hasPurchased ? (
            <>
              <p className="text-xl font-semibold mt-6 text-zinc-800">
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
            </>
          ) : (
            <p className="mt-4 underline">
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download file
              </a>
            </p>
          )}

          {isOwner && (
            <div className="mt-20 space-y-4">
              <h3 className="text-xl font-medium text-gray-700">
                Product Management
              </h3>

              <Button
                onPress={onUnlistModalOpen}
                className="mr-4 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100"
              >
                {product.isActive ? "Unlist Product" : "List Product"}
              </Button>

              <Modal
                isOpen={isUnlistModalOpen}
                onClose={onUnlistModalClose}
                classNames={{
                  backdrop: "bg-black/50",
                  base: "bg-white p-8 rounded-lg shadow-xl",
                  header: "text-lg font-medium text-zinc-900",
                  closeButton: "text-zinc-600 hover:text-zinc-800",
                }}
              >
                <ModalContent>
                  <ModalHeader>
                    Are you sure you want to{" "}
                    {product.isActive ? "unlist" : "list"} this product?
                  </ModalHeader>
                  <ModalBody>
                    {" "}
                    {product.isActive
                      ? "This will remove the product from your store listings, but it will remain available in existing orders. You can relist the product anytime."
                      : "This will relist the product. It will be available for new orders."}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      onPress={onUnlistModalClose}
                      className="mr-3 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
                    >
                      Close
                    </Button>
                    <Button
                      onPress={() => handleProductStatusChange(product.id)}
                      className="border text-sm rounded-lg hover:bg-zinc-100"
                    >
                      {product.isActive ? "Unlist Product" : "List Product"}
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Link href={`/stores/${storeId}/products/${productId}/edit`}>
                <Button className="mr-4 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300">
                  Edit product info
                </Button>
              </Link>

              <Button
                onPress={onDeleteModalOpen}
                className="mr-4 border border-zinc-200 text-sm rounded-lg hover:border-red-600 hover:bg-zinc-100"
              >
                Delete Product
              </Button>

              <Modal
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                classNames={{
                  backdrop: "bg-black/50",
                  base: "bg-white p-8 rounded-lg shadow-xl",
                  header: "text-lg font-medium text-zinc-900",
                  closeButton: "text-zinc-600 hover:text-zinc-800",
                }}
              >
                <ModalContent>
                  <ModalHeader>
                    Are you sure you want to delete this product from your
                    store?
                  </ModalHeader>
                  <ModalBody>This action cannot be undone.</ModalBody>
                  <ModalFooter>
                    <Button
                      onPress={onDeleteModalClose}
                      className="mr-3 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
                    >
                      Close
                    </Button>
                    <Button
                      onPress={() => handleDeleteProduct(product.id)}
                      className="border text-sm rounded-lg border-red-600 hover:bg-zinc-100 hover:text-red-600"
                    >
                      Delete Product
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
