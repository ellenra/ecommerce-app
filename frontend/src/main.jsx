import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/system";
import { CartProvider } from "./hooks/CartContext.jsx";
import { AuthProvider } from "./hooks/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <CartProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CartProvider>
  </NextUIProvider>
);
