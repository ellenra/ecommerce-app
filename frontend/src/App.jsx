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
import Store from "./components/Store";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/store" element={<Store />} />
          </Route>{" "}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
