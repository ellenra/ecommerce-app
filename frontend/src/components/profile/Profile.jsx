import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import userservice from "../../services/userservice";
import { useAuth } from "../../hooks/AuthContext";
import { useFavorites } from "../../hooks/favoriteProducts";
import ProfileForm from "./ProfileForm";
import OrdersPage from "./OrdersPage";
import { toast } from "react-toastify";
import AccountDashboard from "./AccountDashboard";

const Profile = () => {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );
  const [selectedView, setSelectedView] = useState("account");
  const location = useLocation();

  const fetchUserData = async () => {
    try {
      const fetchedUser = await userservice.getUser(
        session.user.id,
        session.access_token
      );
      setUser(fetchedUser);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session has expired. Please log in again.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setSelectedView(path || "account");
  }, [location]);

  const handleViewChange = (view) => {
    setSelectedView(view);
    navigate(`/profile/${view}`);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex w-full md:flex-col md:w-1/4 pl-4 pr-4 mt-4 md:mt-10">
        <Button
          onClick={() => handleViewChange("account")}
          className={`w-full p-6 text-sm md:text-base ${
            selectedView === "account" ? "bg-zinc-100" : "hover:bg-zinc-100"
          }`}
        >
          My Account
        </Button>
        <Button
          onClick={() => handleViewChange("profile")}
          className={`w-full p-6 text-sm md:text-base ${
            selectedView === "profile" ? "bg-zinc-100" : "hover:bg-zinc-100"
          }`}
        >
          Profile
        </Button>
        <Button
          onClick={() => handleViewChange("favorites")}
          className={`w-full p-6 text-sm md:text-base ${
            selectedView === "favorites" ? "bg-zinc-100" : "hover:bg-zinc-100"
          }`}
        >
          Favorites
        </Button>
        <Button
          onClick={() => handleViewChange("order-history")}
          className={`w-full p-6 text-sm md:text-base ${
            selectedView === "order-history"
              ? "bg-zinc-100"
              : "hover:bg-zinc-100"
          }`}
        >
          Order History
        </Button>
      </div>

      <div className="p-10 flex-grow">
        {selectedView === "account" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Account</h2>
            <AccountDashboard user={user} />
          </div>
        )}

        {selectedView === "profile" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>
            <ProfileForm user={user} onProfileUpdate={fetchUserData} />
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
                  <div className="absolute top-2 right-0 z-20">
                    {isFavorite(product.id) ? (
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
                        `/stores/${product.storeId}/products/${product.id}`
                      )
                    }
                  >
                    <p>{product.name}</p>
                    <p>{product.price} €</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedView === "order-history" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Order History</h2>
            <OrdersPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
