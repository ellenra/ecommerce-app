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

const Profile = () => {
  const session = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const { deleteFavorite } = useFavorites(user, setUser);
  const [selectedView, setSelectedView] = useState("account");
  const location = useLocation();

  if (!session) {
    navigate("/");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUser = await userservice.getUser(
          session.user.id,
          session.session.access_token
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

  console.log(user);
  return (
    <div className="flex">
      <div className="mt-10 w-1/4 mr-10">
        <Button
          onClick={() => handleViewChange("account")}
          className={`w-full p-6 ${
            selectedView === "account" ? "bg-zinc-100" : "hover:bg-zinc-100"
          }`}
        >
          My Account
        </Button>
        <Button
          onClick={() => handleViewChange("favorites")}
          className={`w-full p-6 ${
            selectedView === "favorites" ? "bg-zinc-100" : "hover:bg-zinc-100"
          }`}
        >
          Favorites
        </Button>
        <Button
          onClick={() => handleViewChange("orders")}
          className={`w-full p-6 ${
            selectedView === "orders" ? "bg-zinc-100" : "hover:bg-zinc-100"
          }`}
        >
          Orders
        </Button>
      </div>

      <div className="p-10 flex-grow">
        {selectedView === "account" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Account</h2>
            <ProfileForm user={user} />
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
            <OrdersPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
