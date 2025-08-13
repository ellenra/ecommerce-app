import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import userservice from "../../services/userservice";
import { useAuth } from "../../hooks/AuthContext";
import ProfileForm from "./ProfileForm";
import OrdersPage from "./OrdersPage";
import { toast } from "react-toastify";
import AccountDashboard from "./AccountDashboard";
import ProductTable from "../ProductTable";

const Profile = () => {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
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
    } else if (session.user && !user) {
      fetchUserData();
    }
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

        {user && selectedView === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Favorites</h2>
            <ProductTable
              products={user.favorites}
              session={session}
              user={user}
              setUser={setUser}
            />
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
