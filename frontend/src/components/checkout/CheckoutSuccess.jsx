import { useCart } from "../../hooks/CartContext";
import { useEffect } from "react";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>
        Your order has been placed successfully. Thank you for your purchase.
      </p>
    </div>
  );
};

export default CheckoutSuccess;
