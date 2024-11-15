import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/system";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
);
