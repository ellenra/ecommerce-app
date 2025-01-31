import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Image, Link } from "@nextui-org/react";
import storeCategories from "../utils/storeCategories.json";
import storeservice from "../services/storeservice";
import { useAuth } from "../hooks/AuthContext";

const storeSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
  description: z.string(),
  file: z.instanceof(File).optional().nullable(),
  categoryId: z.string().min(1, { message: "Please select category" }),
});

const StoreForm = () => {
  const { storeId } = useParams();
  const { session, user } = useAuth();
  const [viewProfilePicture, setViewProfilePicture] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      file: null,
    },
  });

  const file = watch("file");

  useEffect(() => {
    if (!session) {
      navigate("/login", { state: { from: "/stores/create" } });
      return;
    }
    const checkStore = async () => {
      try {
        const userStore = await storeservice.getUserStore(
          session.user.id,
          session.access_token
        );
        if (userStore?.id) {
          navigate(`/stores/${userStore.id}/dashboard`);
        }
      } catch (error) {
        console.error("Error checking store", error);
      }
    };

    if (storeId) {
      const fetchStoreData = async () => {
        try {
          const storeData = await storeservice.getStore(
            storeId,
            session?.access_token || null
          );
          if (user.id !== storeData.userId) {
            navigate("/");
            return;
          }
          setValue("name", storeData.name);
          setValue("description", storeData.description);
          setValue("categoryId", storeData.categoryId);
          setValue("profileUrl", storeData.profileUrl);
          setViewProfilePicture(storeData.profileUrl);
        } catch (error) {
          console.error("Error fetching store data:", error.message);
        }
      };
      fetchStoreData();
    }
    checkStore();
  }, [session, storeId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setViewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const { name, description, categoryId, file } = data;

      formData.append("userId", user.id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      if (file instanceof File) {
        formData.append("file", file);
      } else {
        formData.append("profileUrl", viewProfilePicture);
      }

      if (storeId) {
        await storeservice.updateStore(storeId, formData, session.access_token);
        toast.success("Store updated successfully!");
        navigate(`/stores/${storeId}`);
      } else {
        const newStore = await storeservice.createStore(
          formData,
          session.access_token
        );
        toast.success("Store created!");
        navigate(`/stores/${newStore.id}`);
      }
    } catch (exception) {
      console.log("error in store form", exception.message);
      if (storeId) {
        toast.error("Failed to update store.");
      } else {
        toast.error("Failed to create store.");
      }
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl space-y-6 p-10"
      >
        <h2 className="text-2xl text-center">
          {storeId ? "Edit Store" : "Create Store"}
        </h2>
        <div className="pb-2">
          <label className="ml-3">Store Name:</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="pb-2">
          <label className="ml-3">Store Description:</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="pb-2">
          <label className="ml-3">Store Category:</label>
          <select
            {...register("categoryId")}
            className="w-full ml-3 bg-white mt-4 border border-gray-200 rounded-lg p-2.5"
          >
            <option value="">Select a category</option>
            {storeCategories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
        <div className="pb-2">
          <label className="ml-3">Profile Image:</label>
          {viewProfilePicture && viewProfilePicture !== "null" ? (
            <>
              <div className="mb-2 ml-3 mt-4">
                <Image
                  shadow="sm"
                  radius="lg"
                  alt="Profile"
                  className="w-full object-cover h-[140px]"
                  src={viewProfilePicture}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => {
                    setValue("file", null);
                    setViewProfilePicture(null);
                  }}
                >
                  Delete Image
                </Button>
              </div>
            </>
          ) : (
            <Input type="file" onChange={handleImageUpload} />
          )}
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}
        </div>
        <Link href={`/stores/${storeId}/dashboard`}>
          <Button className="mr-4 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          className="border border-zinc-200 text-sm rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          {storeId ? "Update Store" : "Create Store"}
        </Button>
      </form>
    </div>
  );
};

export default StoreForm;
