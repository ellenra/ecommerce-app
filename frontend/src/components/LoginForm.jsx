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
    navigate(`/register`);
  };

  return (
    <div>
      <div>
        <p>Log in</p>
        <form onSubmit={handleLogin}>
          <div>
            Email:
            <Input
              type="email"
              label="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            Password:
            <Input
              type="text"
              label="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit">Login</Button>
          <div>
            <br />
            Don't have an account?
            <br></br>
            <Button onClick={goToRegister}>Register here</Button>
            <br></br>
          </div>
        </form>
      </div>
    </div>
  );

  return null;
};

export default Login;
