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

  const goToLogin = async (event) => {
    event.preventDefault();
    navigate("/login");
  };

  return (
    <div>
      <div>
        <form
          onSubmit={handleRegister}
          className="w-full max-w-3xl space-y-6 p-10"
        >
          <h2 className="text-2xl text-center">Sign up</h2>
          <div>
            <label className="ml-3">First name:</label>
            <Input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div>
            <label className="ml-3">Last name:</label>
            <Input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div>
            <label className="ml-3">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <label className="ml-3">Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="ml-3 border border-gray-200 hover:bg-gray-100 rounded-lg"
          >
            Create account
          </Button>
        </form>

        <div className="pt-4 p-10 ml-3">
          <p className="mb-4">Already have an account?</p>
          <Button
            onClick={goToLogin}
            className="border border-gray-200 hover:bg-gray-100 rounded-lg"
          >
            Log in here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
