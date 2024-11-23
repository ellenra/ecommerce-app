import { useEffect, useState } from "react";
import { Link, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useUser } from "../UserContext";
import userService from "../services/userservice";

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
      {user.store && (
        <Link href={`/stores/${user.store.id}`}>Own Store</Link>
      )}{" "}
    </div>
  );
};

export default Profile;
