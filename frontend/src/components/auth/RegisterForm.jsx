import { useNavigate, Navigate, useLocation } from "react-router-dom";
import userService from "../../services/userservice";
import { Input, Button } from "@nextui-org/react";
import supabase from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/AuthContext";

const registerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Register = () => {
  const session = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  if (session.user) {
    return <Navigate to={from} />;
  }

  const onSubmit = async (data) => {
    try {
      const { email, password, firstName, lastName } = data;
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw new Error(error.message);

      const userId = signUpData.user.id;

      await userService.register({
        firstName,
        lastName,
        email,
        userId,
      });
      navigate(from);
    } catch (exception) {
      console.log("error in registration", exception.message);
      toast.error(`Failed to register! Reason: ${exception.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl space-y-6 p-10"
      >
        <h2 className="text-2xl text-center">Sign up</h2>
        <div>
          <label className="ml-3">First name:</label>
          <Input type="text" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="ml-3">Last name:</label>
          <Input type="text" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className="ml-3">Email:</label>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="ml-3">Password:</label>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="ml-3 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
          >
            Create account
          </Button>
        </div>
      </form>

      <div className="flex flex-col items-center pt-4 p-10 ml-3">
        <p className="mb-4">Already have an account?</p>
        <Button
          onClick={() => navigate("/login")}
          className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          Log in here
        </Button>
      </div>
    </div>
  );
};

export default Register;
