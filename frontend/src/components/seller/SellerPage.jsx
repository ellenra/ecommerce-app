import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useAuth } from "../../hooks/AuthContext";
import storeservice from "../../services/storeservice";
import SellerOrdersPage from "./SellerOrdersPage";
import SellerProductsPage from "./SellerProductsPage";

const SellerPage = () => {
  const { session } = useAuth();
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [selectedView, setSelectedView] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/");
      return;
    }

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

  if (!session) {
    return null;
  }

  if (!store) {
    return <div>No store found.</div>;
  }

  return (
    <>
      <Button
        className="ml-6 mt-6 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300 text-sm md:text-base"
        onClick={() => {
          navigate(`/stores/${storeId}`);
        }}
      >
        View Store
      </Button>
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full md:flex-col md:w-1/4 pl-4 pr-4 mt-4 md:mt-10">
          <Button
            onClick={() => handleViewChange("dashboard")}
            className={`w-full p-6 text-sm md:text-base ${
              selectedView === "dashboard" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => handleViewChange("products")}
            className={`w-full p-6 text-sm md:text-base ${
              selectedView === "products" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Manage Products
          </Button>
          <Button
            onClick={() => handleViewChange("orders")}
            className={`w-full p-6 text-sm md:text-base ${
              selectedView === "orders" ? "bg-zinc-100" : "hover:bg-zinc-100"
            }`}
          >
            Manage Orders
          </Button>
        </div>
        {selectedView === "dashboard" && (
          <div className="m-4">
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
          </div>
        )}
        {selectedView === "orders" && <SellerOrdersPage store={store} />}
        {selectedView === "products" && (
          <SellerProductsPage store={store} session={session} />
        )}
      </div>
    </>
  );
};

export default SellerPage;
