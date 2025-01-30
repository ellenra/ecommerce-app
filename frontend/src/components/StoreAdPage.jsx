import React, { useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import storeservice from "../services/storeservice";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

const StoreAdPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkStore = async () => {
      try {
        const userStore = await storeservice.getUserStore(
          session.user.id,
          session.access_token
        );
        if (userStore?.id) {
          navigate(`/stores/${userStore.id}/dashboard`);
        }
      } catch (error) {
        console.error("Error checking store", error);
      }
    };

    if (session) {
      checkStore();
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center p-10">
      <p className="text-2xl text-center mb-6">Ready to become a seller?</p>
      <Button
        onClick={() => {
          navigate("/stores/create");
        }}
        className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
      >
        Create Store
      </Button>{" "}
      <p className="text-l text-center mt-10 mb-4">Already have a store?</p>
      <Button
        onClick={() => {
          navigate("/login", { state: { from: "/stores/ad" } });
        }}
        className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
      >
        Sign in
      </Button>{" "}
    </div>
  );
};

export default StoreAdPage;
