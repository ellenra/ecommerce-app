import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/system";
import { CartProvider } from "./hooks/CartContext.jsx";
import { AuthProvider } from "./hooks/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <CartProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </CartProvider>
  </NextUIProvider>
);
