import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/HomePage";
import Layout from "./components/Layout";
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
import { UserProvider } from "./UserContext";
import Profile from "./components/Profile";
import CreateStore from "./components/CreateStore";
import Store from "./components/Store";
import ListProductForm from "./components/ListProductForm";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="stores/create" element={<CreateStore />} />
            <Route path="stores/:storeId" element={<Store />} />
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
