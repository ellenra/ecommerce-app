import { useEffect, useState } from "react";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewStores = () => {
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
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {stores.map((store) => (
        <Card
          key={store.id}
          isPressable
          className="bg-white hover:cursor-pointer"
          onClick={() => navigate(`${store.id}`)}
        >
          <CardBody className="flex items-center">
            <Image
              src={store.profileUrl}
              className="object-cover w-full h-[200px]"
            />
            <h3 className="text-lg mt-4">{store.name}</h3>
            <p>{store.description}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ViewStores;
