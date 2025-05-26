import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { useCart } from "../hooks/CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "./checkout/CheckoutButton";

const Cart = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  return (
    <div className="mt-10">
      <h1 className="text-2xl text-center mb-6">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="flex flex-col items-center gap-6 p-6 max-w-3xl mx-auto">
          {cartItems.map((item) => (
            <>
              <Card
                key={item.id}
                className="w-full rounded-sm"
                isPressable
                onPress={() =>
                  navigate(`/stores/${item.storeId}/products/${item.id}`, {
                    state: { from: "/cart" },
                  })
                }
              >
                <CardBody className="flex flex-row gap-10">
                  <Image
                    alt={item.name}
                    src={item.imageUrl}
                    className="w-28 h-28 rounded-sm"
                  />
                  <div className="flex-1">
                    <h2>{item.name}</h2>
                    <p>{item.price} €</p>
                  </div>
                </CardBody>
              </Card>
              <div className="p-6 bg-zinc-50 rounded-sm w-full">
                <h3 className="ml-4">Order Summary</h3>
                <p className="text-sm ml-4">
                  Total:
                  <span className="font-bold">{totalPrice.toFixed(2)} €</span>
                </p>
                <div className="mt-4 flex justify-between">
                  <Button onClick={clearCart}>Clear Cart</Button>
                  <CheckoutButton cartItems={cartItems} />
                </div>
                <Button
                  className="text-sm underline"
                  onClick={() => navigate("/stores")}
                >
                  Continue shopping
                </Button>
              </div>
            </>
          ))}
        </div>
      ) : (
        <p className="text-center mt-10">
          Your cart is empty. Start adding items!
        </p>
      )}
    </div>
  );
};

export default Cart;
