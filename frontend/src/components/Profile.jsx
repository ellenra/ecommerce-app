import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";
import { useFavorites } from "../hooks/favoriteProducts";

const Profile = () => {
  const session = useAuth();
  const [sessionReady, setSessionReady] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const { deleteFavorite } = useFavorites(user, setUser);

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
    <div>
      <div className="px-10">
        <h2 className="mb-4">Favorites</h2>
        <div className="flex overflow-x-scroll scrollbar-thin scrollbar-thumb-zinc-100 scrollbar-track-transparent gap-6 pb-4">
          {user.favorites.map((product, index) => (
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
