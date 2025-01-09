import { useCart } from "../../hooks/CartContext";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import orderservice from "../../services/orderservice";
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const [order, setOrder] = useState(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");

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

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-3">
          Thank you for your purchase
        </h1>
        <p className="text-lg text-center mb-12">
          We have received your order. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Totam, facilis nobis eius obcaecati qui
        </p>

        {order && (
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <p className="text-sm">Order ID:</p>
              <p className="font-semibold">{order.id}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm">Total:</p>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
            </div>

            <h3 className="font-semibold mt-10 mb-4">Order Summary</h3>
            <ul>
              {order.orderItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-zinc-50 hover:bg-zinc-100"
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

            <div className="mt-8 mb-4 text-right">
              <Button
                onClick={() => navigate("/stores")}
                className="border rounded-lg hover:bg-zinc-100"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
