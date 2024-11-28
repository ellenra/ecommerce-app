import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/system";
import { CartProvider } from "./CartContext.jsx";
import { UserProvider } from "./UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <CartProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CartProvider>
  </NextUIProvider>
);
