import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { useCart } from "../hooks/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  return (
    <div className="mt-10">
      <h1 className="text-2xl text-center mb-6">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="flex flex-col items-center gap-6">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="w-4/5 lg:w-[40%] shadow-lg rounded-lg"
            >
              <CardBody
                className="flex flex-row items-center gap-4 hover:cursor-pointer"
                onClick={() =>
                  navigate(`/stores/${item.storeId}/products/${item.id}`)
                }
              >
                <Image
                  alt={item.name}
                  src={item.imageUrl}
                  className="w-28 h-28 rounded-lg mt-4"
                />
                <div className="flex-1">
                  <h2>{item.name}</h2>
                  <p>{item.price} €</p>
                  <p className="text-sm text-zinc-500">
                    Quantity: {item.count}
                  </p>
                </div>
              </CardBody>
              <CardFooter className="flex justify-between items-center">
                <div>
                  <Button onClick={() => removeFromCart(item.id, null)}>
                    -
                  </Button>
                  <Button onClick={() => addToCart(item)}>+</Button>
                </div>
                <Button onClick={() => removeFromCart(item.id, item)}>
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center mt-10">
          Your cart is empty. Start adding items!
        </p>
      )}

      {cartItems.length > 0 && (
        <div className="m-6 p-6 bg-zinc-50 rounded-lg w-4/5 lg:w-[40%] mx-auto shadow-lg">
          <h3 className="ml-4">Orger Summary</h3>
          <p className="text-sm ml-4">
            Total: <span className="font-bold">{totalPrice.toFixed(2)} €</span>
          </p>
          <div className="mt-4 flex justify-between">
            <Button onClick={clearCart}>Clear Cart</Button>
            <Button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
          <Button
            className="text-sm underline"
            onClick={() => navigate("/stores")}
          >
            Continue shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
