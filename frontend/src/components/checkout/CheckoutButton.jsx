import axios from "axios";
import { Button } from "@nextui-org/react";
import { useAuth } from "../../hooks/AuthContext";
import { useState, useEffect } from "react";

const baseUrl = "http://localhost:5000/api";

const CheckoutButton = ({ cartItems }) => {
  const session = useAuth();
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    if (session === null) {
      return;
    }
    setUserFetched(true);
  }, [session]);

  const handleCheckout = () => {
    axios
      .post(`${baseUrl}/stripe/create-checkout-session`, {
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
      <Button onClick={() => handleCheckout()}>Check out</Button>
    </>
  );
};

export default CheckoutButton;
