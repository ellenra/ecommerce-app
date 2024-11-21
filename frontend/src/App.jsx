import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage";
import Layout from "./components/Layout";
import Register from "./components/RegisterForm";
import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        console.log("session:", session.user);
      }
    );
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/register" element={<Register />} />
        </Route>{" "}
      </Routes>
    </Router>
  );
}

export default App;
