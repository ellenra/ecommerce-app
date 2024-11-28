import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useUser } from "../UserContext";
import userService from "../services/userservice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const currentUser = useUser();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const user = await userService.getUser(currentUser.id);
          setUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Favorites:</div>
      {user.store ? (
        <Button as={Link} to={`/stores/${user.store.id}`}>
          Own Store
        </Button>
      ) : (
        <Button
          as={Link}
          to="/stores/create"
          className="hover:bg-zinc-100 rounded-lg border"
        >
          Create Store
        </Button>
      )}
    </div>
  );
};

export default Profile;
