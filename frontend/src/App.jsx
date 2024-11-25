import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
import { UserProvider } from "./UserContext";
import Profile from "./components/Profile";
import Store from "./components/Store";
import ListProductForm from "./components/ListProductForm";
import ViewStores from "./components/ViewStores";
import StoreForm from "./components/StoreForm";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<ViewStores />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="stores" element={<ViewStores />} />
            <Route path="stores/create" element={<StoreForm />} />
            <Route path="stores/:storeId" element={<Store />} />
            <Route path="stores/:storeId/edit" element={<StoreForm />} />
            <Route
              path="stores/:storeId/products/new"
              element={<ListProductForm />}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>{" "}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
