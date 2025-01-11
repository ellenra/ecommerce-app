import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";
import { useFavorites } from "../hooks/favoriteProducts";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const session = useAuth();
  const [sessionReady, setSessionReady] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const { deleteFavorite } = useFavorites(user, setUser);
  const [selectedView, setSelectedView] = useState("account");

  useEffect(() => {
    if (session === null) {
      return;
    }
    setSessionReady(true);
  }, [session]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionReady && session.user) {
        try {
          const fetchedUser = await userservice.getUser(session.user.id);
          setUser(fetchedUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else if (sessionReady && !session.user) {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [sessionReady, session]);

  if (!sessionReady || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <div className="mt-10 w-1/4 mr-10">
        <div>
          <Button
            onClick={() => setSelectedView("account")}
            className={`w-full p-6 ${
              selectedView === "account" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            My Account
          </Button>
          <Button
            onClick={() => setSelectedView("favorites")}
            className={`w-full p-6 ${
              selectedView === "favorites" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Favorites
          </Button>
          <Button
            onClick={() => setSelectedView("orders")}
            className={`w-full p-6 ${
              selectedView === "orders" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Orders
          </Button>
          <Button
            onClick={() => setSelectedView("store")}
            className={`w-full p-6 ${
              selectedView === "store" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            My Store
          </Button>
        </div>
      </div>

      <div className="p-10 flex-grow">
        {selectedView === "account" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Account</h2>
            <ProfileForm />
          </div>
        )}

        {selectedView === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Favorites</h2>
            <div className="grid grid-cols-6 gap-6">
              {user.favorites.map((product, index) => (
                <Card
                  key={index}
                  className="min-w-[200px] shadow-md rounded-lg hover:shadow-xl cursor-pointer"
                >
                  <CardBody
                    className="p-0 hover:cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/stores/${product.storeId}/products/${product.id}`
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
                  <CardFooter
                    className="flex flex-row justify-between hover:cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/stores/${product.storeId}/products/${product.id}`
                      )
                    }
                  >
                    <p>{product.name}</p>
                    <p>{product.price} €</p>
                  </CardFooter>
                  <div className="flex justify-end -mr-3 -mt-4">
                    <Button
                      onClick={() => deleteFavorite(product.id)}
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      {hoveredProductId === product.id ? (
                        <FavoriteBorderIcon />
                      ) : (
                        <FavoriteIcon />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedView === "orders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Orders</h2>
            <p>Orders here</p>
          </div>
        )}

        {selectedView === "store" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Store</h2>
            <p>owners store view here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
