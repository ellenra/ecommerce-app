import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import userService from "../services/userservice";
import { Input, Button } from "@nextui-org/react";
import supabase from "../supabaseClient";
import { useUser } from "../UserContext";

const Register = () => {
  const user = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const userId = data.user.id;

      const newUser = await userService.register({
        firstName,
        lastName,
        email,
        userId,
      });
      setFirstName("");
      setLastName("");
      setPassword("");
      setEmail("");
      navigate("/");
    } catch (exception) {
      console.log("error in registration", exception.message);
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleRegister}>
          <div>Register:</div>
          <div>
            First name:
            <Input
              type="text"
              label="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div>
            Last name:
            <Input
              type="text"
              label="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div>
            Password:
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            Email address:
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button type="submit">Create account</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
