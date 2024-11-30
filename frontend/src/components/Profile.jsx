import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useUser } from "../UserContext";
import userService from "../services/userservice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const currentUser = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const fetchedUser = await userService.getUser(currentUser.id);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && !loading) {
      navigate("/");
    }
  }, [user]);

  if (loading) {
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
