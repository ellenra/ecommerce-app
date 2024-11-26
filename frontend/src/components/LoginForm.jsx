import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import supabase from "../supabaseClient";
import { useUser } from "../UserContext";

const Login = () => {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log("error when logging in", error);
      }
      setEmail("");
      setPassword("");
    } catch (exception) {
      console.log("error in login", exception);
    }
  };

  const goToRegister = async (event) => {
    event.preventDefault();
    navigate("/register");
  };

  return (
    <div>
      <div>
        <form
          onSubmit={handleLogin}
          className="w-full max-w-3xl space-y-6 p-10"
        >
          <h2 className="text-2xl text-center">Log in</h2>

          <div>
            <label className="ml-3">Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-4"
            />
          </div>
          <div>
            <label className="ml-3">Password:</label>
            <Input
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-4"
            />
          </div>
          <Button
            type="submit"
            className="ml-3 border border-gray-200 hover:bg-gray-100 rounded-lg"
          >
            Login
          </Button>
        </form>
        <div className="pt-4 p-10 ml-3">
          <p className="mb-4">Don't have an account?</p>
          <Button
            onClick={goToRegister}
            className="border border-gray-200 hover:bg-gray-100 rounded-lg"
          >
            Register here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
