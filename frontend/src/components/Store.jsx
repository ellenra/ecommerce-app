import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import userservice from "../services/userservice";
import { useFavorites } from "../hooks/favoriteProducts";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import storeservice from "../services/storeservice";

const Store = () => {
  const { storeId } = useParams();
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
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
    const fetchStore = async () => {
      try {
        const response = await storeservice.getStore(
          storeId,
          session?.access_token || null
        );
        setStore(response);
        if (session && response) {
          setIsOwner(session.user.id === response.userId);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStore();
  }, [storeId]);

  if (!store) {
    return <div>No store found.</div>;
  }

  //Show only listed products in store view for store owners too
  const filteredProducts = store.products.filter((product) => product.isActive);

  return (
    <div>
      {isOwner && (
        <Button
          className="ml-6 mt-6 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
          onClick={() => {
            navigate(`/stores/${storeId}/dashboard`);
          }}
        >
          Manage Store
        </Button>
      )}
      <>
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <p className="text-lg mt-2">{store.description}</p>
        </div>
        <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-6 p-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={index}
              className="min-w-[200px] shadow-md rounded-lg hover:shadow-xl"
            >
              <CardBody
                className="p-0 hover:cursor-pointer"
                onClick={() =>
                  navigate(
                    `/stores/${product.storeId}/products/${product.id}`,
                    {
                      state: { from: `/stores/${product.storeId}` },
                    }
                  )
                }
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width="200px"
                  height="200px"
                />
              </CardBody>
              <div className="absolute top-2 right-0 z-20">
                {session && isFavorite(product.id) ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      deleteFavorite(product.id, session.access_token)
                    }
                  >
                    <FavoriteIcon />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      addFavorite(product.id, session?.access_token)
                    }
                  >
                    <FavoriteBorderIcon />
                  </Button>
                )}
              </div>
              <CardFooter
                className="flex flex-row justify-between hover:cursor-pointer"
                onClick={() =>
                  navigate(
                    `/stores/${product.storeId}/products/${product.id}`,
                    {
                      state: { from: `/stores/${product.storeId}` },
                    }
                  )
                }
              >
                <p>{product.name}</p>
                <p>{product.price} €</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </>
    </div>
  );
};

export default Store;
