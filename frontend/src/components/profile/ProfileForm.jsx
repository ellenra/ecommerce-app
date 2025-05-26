import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useAuth } from "../../hooks/AuthContext";
import userservice from "../../services/userservice";

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string(),
  postalCode: z
    .string()
    .regex(/^\d+$/, { message: "Invalid postal code" })
    .optional(),
  city: z.string(),
  country: z.string(),
});

const ProfileForm = ({ user, onProfileUpdate }) => {
  const { session } = useAuth();

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
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("address", user.address || "");
      setValue("postalCode", user.postalCode || undefined);
      setValue("city", user.city || "");
      setValue("country", user.country || "");
    }
  }, [user]);

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

      await userservice.updateUser(session.user.id, data, session.access_token);
      toast.success("Profile updated successfully!");

      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (exception) {
      console.log("error in profile form", exception.message);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="lg:flex lg:flex-row">
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

        <div className="lg:flex lg:flex-row">
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
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>
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
