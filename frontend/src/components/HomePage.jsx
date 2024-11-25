import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stores");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {stores.map((store, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => navigate(`/stores/${store.id}`)}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={store.name}
              className="w-full object-cover h-[140px]"
              src={store.profileUrl}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{store.name}</b>
            <p className="text-default-500">{store.description}</p>{" "}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Home;
