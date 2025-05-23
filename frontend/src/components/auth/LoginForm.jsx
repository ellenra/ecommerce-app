import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import supabase from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/AuthContext";
import { toast } from "react-toastify";
import adminservice from "../../services/adminservice";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  if (session) {
    return <Navigate to={from} />;
  }

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);

      const isAdminResponse = await adminservice.checkAdmin(user.user.id);

      if (isAdminResponse && isAdminResponse.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate(from);
      }
    } catch (exception) {
      console.log("error in login", exception);
      toast.error(`Log in failed! ${exception.message}!`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl space-y-6 p-10"
      >
        <h2 className="text-2xl text-center">Log in</h2>

        <div>
          <label className="ml-3">Email:</label>
          <Input type="email" {...register("email")} className="mt-4" />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="ml-3">Password:</label>
          <Input type="password" {...register("password")} className="mt-4" />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="ml-3 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          Login
        </Button>
      </form>
      <div className="pt-4 p-10 ml-3">
        <p className="mb-4">Don't have an account?</p>
        <Button
          onClick={() => {
            navigate("/register", { state: { from: from } });
          }}
          className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          Register here
        </Button>
      </div>
    </div>
  );
};

export default Login;
