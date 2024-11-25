import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useUser } from "../UserContext";
import userService from "../services/userservice";
import { Link } from "react-router-dom";

const Profile = () => {
  const currentUser = useUser();
  const [user, setUser] = useState(null);

  console.log(currentUser);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const user = await userService.getUser(currentUser.id);
          setUser(user);
          console.log("Fetched user data:", user);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  console.log(user);

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
        <Button as={Link} to="/stores/create">
          Create Store
        </Button>
      )}
    </div>
  );
};

export default Profile;
