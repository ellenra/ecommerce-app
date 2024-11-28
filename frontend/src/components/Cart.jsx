import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      {cartItems.map((item) => (
        <>
          <Card
            key={item.id}
            isPressable
            onPress={() =>
              navigate(`/stores/${item.storeId}/products/${item.id}`)
            }
            className="mx-auto"
          >
            <CardBody>
              <Image
                radius="lg"
                alt={item.name}
                src={item.imageUrl}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            </CardBody>
            <CardFooter>
              <p>
                {item.name} {item.price} <br />
              </p>
            </CardFooter>
          </Card>
          Quantity: {item.count}
          <Button onClick={() => addToCart(item)}>+</Button>
          <Button onClick={() => removeFromCart(item.id, null)}>-</Button>
          <Button onClick={() => removeFromCart(item.id, item)}>Delete</Button>
        </>
      ))}
      <br />
      {cartItems.length > 0 && (
        <Button onClick={() => clearCart()}>Clear cart</Button>
      )}
    </div>
  );
};

export default Cart;
