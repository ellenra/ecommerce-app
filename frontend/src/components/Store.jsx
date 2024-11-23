import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";
import { Button } from "@nextui-org/react";
import ListProductForm from "./ListProductForm";

const Store = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const user = useUser();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`/api/stores/${storeId}`);
        setStore(response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStore();
  }, [storeId]);

  if (!store) {
    return <div>Loading...</div>;
  }

  const isOwner = user && user.id === store.userId;

  return (
    <div>
      <h1>{store.name}</h1>
      <p>{store.description}</p>
      <p>Category: {store.category}</p>

      {isOwner && (
        <>
          <ListProductForm storeId={storeId} />
          <Link to={`/stores/${storeId}/manage`}>
            <button>Manage Your Store</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Store;
