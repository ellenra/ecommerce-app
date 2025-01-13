import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import userService from "../../services/userservice";
import { useAuth } from "../../hooks/AuthContext";
import userservice from "../../services/userservice";

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string(),
  postalCode: z.number().optional(),
  city: z.string(),
  country: z.string(),
});

const ProfileForm = () => {
  const session = useAuth();
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      return;
    }
    setSessionReady(true);
  }, [session]);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      postalCode: undefined,
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionReady && session.user) {
        try {
          const userData = await userService.getUser(session.user.id);
          setValue("firstName", userData.firstName);
          setValue("lastName", userData.lastName);
          setValue("email", userData.email);
          setValue("address", userData.address || "");
          setValue("postalCode", userData.postalCode || undefined);
          setValue("city", userData.city || "");
          setValue("country", userData.country || "");
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      } else if (sessionReady && !session.user) {
        navigate("/");
      }
    };
    fetchUserData();
  }, [sessionReady, session]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const { firstName, lastName, email, address, postalCode, city, country } =
        data;

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("postalCode", postalCode);
      formData.append("city", city);
      formData.append("country", country);

      await userservice.updateUser(session.user.id, data);
      toast.success("Profile updated successfully!");
    } catch (exception) {
      console.log("error in profile form", exception.message);
      toast.error("Failed to update profile.");
    }
  };

  if (!sessionReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-1/3 mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="pb-2">
          <label className="ml-3">First Name:</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="pb-2">
          <label className="ml-3">Last Name:</label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        <div className="pb-2">
          <label className="ml-3">Email:</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="pb-2">
          <label className="ml-3">Address:</label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="pb-2">
          <label className="ml-3">Postal Code:</label>
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.postalCode && (
            <p className="text-red-500">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="pb-2">
          <label className="ml-3">City:</label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </div>

        <div className="pb-2">
          <label className="ml-3">Country:</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.country && (
            <p className="text-red-500">{errors.country.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="border border-gray-200 rounded px-4 py-2 hover:bg-gray-100 text-sm"
        >
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
