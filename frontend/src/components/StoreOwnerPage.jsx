import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@nextui-org/react";
import StoreOwnerOrdersPage from "./StoreOwnerOrdersPage";
import { useAuth } from "../hooks/AuthContext";
import storeservice from "../services/storeservice";

const StoreOwnerPage = () => {
  const { session } = useAuth();
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [selectedView, setSelectedView] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  if (!session) {
    navigate("/");
  }

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await storeservice.getStore(
          storeId,
          session?.access_token || null
        );
        if (session.user.id !== response.userId) {
          navigate("/");
          return;
        }
        setStore(response);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStore();
  }, [storeId]);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setSelectedView(path || "dashboard");
  }, [location]);

  const handleViewChange = (view) => {
    setSelectedView(view);
    navigate(`/stores/${storeId}/${view}`);
  };

  if (!store) {
    return <div>No store found.</div>;
  }
  return (
    <div className="flex">
      <div className="mt-10 w-1/4 mr-10">
        <div>
          <Button
            onClick={() => handleViewChange("dashboard")}
            className={`w-full p-6 ${
              selectedView === "dashboard" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => handleViewChange("orders")}
            className={`w-full p-6 ${
              selectedView === "orders" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Manage Orders
          </Button>
          <Button
            onClick={() => handleViewChange("products")}
            className={`w-full p-6 ${
              selectedView === "products" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Manage Products
          </Button>
        </div>
      </div>
      {selectedView === "dashboard" && (
        <>
          <Link to={`/stores/${storeId}/products/new`}>
            <Button className="border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300 mr-4">
              List new product
            </Button>
          </Link>
          <Link to={`/stores/${storeId}/edit`}>
            <Button className="border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300">
              Edit Store Info
            </Button>
          </Link>
        </>
      )}
      {selectedView === "orders" && <StoreOwnerOrdersPage store={store} />}
    </div>
  );
};

export default StoreOwnerPage;
