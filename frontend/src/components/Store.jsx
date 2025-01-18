import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import userservice from "../services/userservice";
import { useFavorites } from "../hooks/favoriteProducts";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const Store = () => {
  const { storeId } = useParams();
  const session = useAuth();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session.user) return;

      try {
        const fetchedUser = await userservice.getUser(session.user.id);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session.user]);

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

  const isOwner = session.user && session.user.id === store.userId;

  return (
    <div>
      {isOwner && (
        <Button
          className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
          onClick={() => {
            navigate(`/stores/${storeId}/dashboard`);
          }}
        >
          Manage Store
        </Button>
      )}
      <>
        <div className=" py-6 text-center">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <p className="text-lg mt-2">{store.description}</p>
        </div>
        <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-6 p-6">
          {store.products.map((product, index) => (
            <Card
              key={index}
              className="min-w-[200px] shadow-md rounded-lg hover:shadow-xl"
            >
              <CardBody
                className="p-0 hover:cursor-pointer"
                onClick={() =>
                  navigate(`/stores/${product.storeId}/products/${product.id}`)
                }
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width="200px"
                  height="200px"
                />
              </CardBody>
              <CardFooter
                className="flex flex-row justify-between hover:cursor-pointer"
                onClick={() =>
                  navigate(`/stores/${product.storeId}/products/${product.id}`)
                }
              >
                <p>{product.name}</p>
                <p>{product.price} €</p>
              </CardFooter>
              <div className="flex justify-end -mr-3">
                {isFavorite(product.id) ? (
                  <Button onClick={() => deleteFavorite(product.id)}>
                    <FavoriteIcon fontSize="small" />
                  </Button>
                ) : (
                  <Button onClick={() => addFavorite(product.id)}>
                    <FavoriteBorderIcon fontSize="small" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </>
    </div>
  );
};

export default Store;
