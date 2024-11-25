import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
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
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 p-6">
      {stores.map((store, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => navigate(`/stores/${store.id}`)}
          className="mx-auto"
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={store.name}
              className="w-full object-cover h-[140px]"
              src={store.profileUrl}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </CardBody>
          <CardFooter className="p-4 text-sm flex justify-between items-center">
            <b>{store.name}</b>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ViewStores;
