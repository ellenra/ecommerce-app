import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
import Profile from "./components/Profile";
import Store from "./components/Store";
import ViewStores from "./components/ViewStores";
import StoreForm from "./components/StoreForm";
import Product from "./components/Product";
import ProductForm from "./components/ProductForm";
import Cart from "./components/Cart";
import Home from "./components/Home";
import CheckoutSuccess from "./components/checkout/CheckoutSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="stores" element={<ViewStores />} />
          <Route path="stores/create" element={<StoreForm />} />
          <Route path="stores/:storeId" element={<Store />} />
          <Route path="stores/:storeId/edit" element={<StoreForm />} />
          <Route
            path="stores/:storeId/products/new"
            element={<ProductForm />}
          />
          <Route
            path="stores/:storeId/products/:productId"
            element={<Product />}
          />
          <Route
            path="stores/:storeId/products/:productId/edit"
            element={<ProductForm />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
        </Route>{" "}
      </Routes>
    </Router>
  );
}

export default App;
