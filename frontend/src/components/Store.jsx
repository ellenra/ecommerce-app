import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import userservice from "../services/userservice";
import { Button } from "@nextui-org/react";
import storeservice from "../services/storeservice";
import ProductTable from "./ProductTable";

const Store = () => {
  const { storeId } = useParams();
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      try {
        const fetchedUser = await userservice.getUser(
          session.user.id,
          session.access_token
        );
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await storeservice.getStore(
          storeId,
          session?.access_token || null
        );
        setStore(response);
        if (session && response) {
          setIsOwner(session.user.id === response.userId);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStore();
  }, [storeId]);

  if (!store) {
    return <div>No store found.</div>;
  }

  //Show only listed products in store view for store owners too
  const filteredProducts = store.products.filter((product) => product.isActive);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {isOwner && (
        <Button
          className="ml-6 mt-6 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
          onClick={() => {
            navigate(`/stores/${storeId}/dashboard`);
          }}
        >
          Manage Store
        </Button>
      )}
      <>
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <p className="text-lg mt-2">{store.description}</p>
        </div>
        <ProductTable
          products={filteredProducts}
          session={session}
          user={user}
          setUser={setUser}
        />
      </>
    </div>
  );
};

export default Store;
