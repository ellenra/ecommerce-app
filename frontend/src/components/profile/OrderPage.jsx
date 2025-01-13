import { useEffect, useState } from "react";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import orderservice from "../../services/orderservice";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await orderservice.getOrder(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order");
      }
    };

    fetchOrder();
  }, []);

  if (!order) {
    return <>Loading...</>;
  }

  return (
    <>
      <Button
        onClick={() => navigate("/profile/orders")}
        className="ml-10 rounded px-4 py-2 hover:bg-gray-100 text-sm"
      >
        {" "}
        <KeyboardBackspaceIcon />
      </Button>
      <div className="py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-center mb-10">
            Order Number: {order.id}
          </h1>

          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <p className="text-sm">Order Date:</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <p className="text-sm">Status:</p>
              {order.status === "PENDING" ? (
                <p className="font-semibold">PROCESSING</p>
              ) : (
                <p className="font-semibold">{order.status}</p>
              )}
            </div>
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <p className="text-sm">Total:</p>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-sm">Shipping Address:</p>
              <p className="font-semibold">{order.shippingAddress.line1}</p>
            </div>
            {order.shippingAddress.line2 && (
              <div className="flex justify-end">
                <p className="font-semibold">{order.shippingAddress.line2}</p>
              </div>
            )}
            <div className="flex justify-end">
              <p className="font-semibold">
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </p>
            </div>
            <div className="flex justify-end">
              <p className="font-semibold">{order.shippingAddress.country}</p>
            </div>

            <ul>
              {order.orderItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex justify-between itms-center p-4 bg-zinc-50 hover:bg-zinc-100 mt-6"
                >
                  <CardBody
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/stores/${item.product.storeId}/products/${item.product.id}`
                      )
                    }
                  >
                    <Image
                      alt={item.name}
                      src={item.product.imageUrl}
                      className="w-28 h-28 rounded-lg mr-6"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-medium">{item.product.name}</p>
                      <p className="text-sm">
                        {item.quantity} x ${item.product.price}
                      </p>
                    </div>
                    <div className="font-semibold">
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
