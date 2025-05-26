import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import orderservice from "../../services/orderservice";
import { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const AccountDashboard = ({ user }) => {
  const { session } = useAuth();
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session.user) return;

      try {
        const response = await orderservice.getOrdersByUserId(
          session.user.id,
          session.access_token
        );
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, [session]);

  if (!orders) {
    return;
  }

  return (
    <>
      <h2 className="text-2xl mb-6 mt-10">Purchases</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {orders.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id}>
              {order.orderItems.map((product) => (
                <Card
                  key={product.id}
                  shadow="sm"
                  isPressable
                  onPress={() =>
                    navigate(
                      `/stores/${product.product.storeId}/products/${product.product.id}`,
                      {
                        state: { from: "/profile/account" },
                      }
                    )
                  }
                >
                  <CardBody className="p-0">
                    <Image
                      alt={product.product.name}
                      src={product.product.imageUrl}
                      className="object-cover w-full h-[200px]"
                    />
                  </CardBody>
                  <CardFooter className="flex flex-col items-start -ml-3">
                    <p>{product.product.name}</p>
                    <p className="underline">
                      <a
                        href={product.product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download file
                      </a>
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AccountDashboard;
