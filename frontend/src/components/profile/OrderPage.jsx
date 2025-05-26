import { Button, Card, CardBody, Image } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const OrderPage = () => {
  const location = useLocation();
  const { order } = location.state || {};
  const navigate = useNavigate();

  if (!order) {
    return <>Loading...</>;
  }

  return (
    <>
      <Button
        onClick={() => navigate("/profile/purchases")}
        className="ml-10 mt-4 rounded text-sm"
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
              <p className="text-sm">Total:</p>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
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
