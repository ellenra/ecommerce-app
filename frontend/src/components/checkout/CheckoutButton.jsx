import axios from "axios";
import { Button } from "@nextui-org/react";
import { useAuth } from "../../hooks/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.API_URL;

const CheckoutButton = ({ cartItems }) => {
  const session = useAuth();
  const [userFetched, setUserFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      return;
    }
    setUserFetched(true);
  }, [session]);

  const handleCheckout = () => {
    axios
      .post(`${baseUrl}/api/stripe/create-checkout-session`, {
        cartItems,
        userId: session.user.id,
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  if (!userFetched) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {session.user ? (
        <Button onClick={() => handleCheckout()}>Check out</Button>
      ) : (
        <Button
          onClick={() => navigate("/login", { state: { from: "/cart" } })}
          className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          Log in to checkout
        </Button>
      )}
    </>
  );
};

export default CheckoutButton;
