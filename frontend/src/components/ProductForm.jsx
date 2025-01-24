import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Image, Link } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import storeservice from "../services/storeservice";
import { useAuth } from "../hooks/AuthContext";
import productservice from "../services/productservice";
import Select from "react-select";

const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.preprocess(
    (value) => parseFloat(value),
    z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price is required",
      })
      .positive({ message: "Price must be positive" })
  ),
  quantity: z.preprocess(
    (value) => parseInt(value, 10),
    z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity is required",
      })
      .positive({ message: "Quantity must be positive" })
  ),
  imageUrl: z.string(),
  file: z
    .instanceof(File, { message: "Image is required" })
    .optional()
    .nullable(),
  categories: z
    .array(z.string())
    .min(1, { message: "Select at least one category" }),
});

const ProductForm = () => {
  const { session, loading, user } = useAuth();
  const { storeId, productId } = useParams();
  const [viewProductPicture, setViewProductPicture] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  if (!session) {
    navigate("/");
  }

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      imageUrl: "",
      file: null,
      categories: [],
    },
  });

  const file = watch("file");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await productservice.getProductCategories();
        setCategoryList(
          categories.map((cat) => ({ value: cat.id, label: cat.name }))
        );
      } catch (error) {
        console.error("Error fetching categories", error.message);
      }
    };
    fetchCategories();

    if (productId) {
      const fetchProductData = async () => {
        try {
          const productData = await storeservice.getProduct(productId);
          if (session.user.id !== productData.userId) {
            navigate("/");
          }
          setValue("name", productData.name);
          setValue("description", productData.description);
          setValue("price", productData.price);
          setValue("quantity", productData.quantity);
          setValue("imageUrl", productData.imageUrl);
          setViewProductPicture(productData.imageUrl);
          const categoryIds = productData.categories.map(
            (category) => category.categoryId
          );
          setValue("categories", categoryIds);
        } catch (error) {
          console.error("Error fetching product data:", error.message);
        }
      };

      fetchProductData();
    }
  }, [session, loading, productId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setViewProductPicture(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const { name, description, price, quantity, file, categories } = data;
      if (productId) {
        formData.append("productId", productId);
      }
      formData.append("userId", session.user.id);
      formData.append("storeId", storeId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("categories", JSON.stringify(categories));
      if (file instanceof File) {
        formData.append("file", file);
      } else {
        formData.append("imageUrl", viewProductPicture);
      }
      if (productId) {
        await storeservice.updateProduct(formData, session.access_token);
        toast.success("Product updated successfully!");
        navigate(`/stores/${storeId}/products/${productId}`);
      } else {
        await storeservice.listProduct(formData, session.access_token);
        toast.success("Product created!");
        navigate(`/stores/${storeId}`);
      }
    } catch (error) {
      console.error("Error listing product:", error.message);
      if (productId) {
        toast.error("Failed to update product!");
      } else {
        toast.error("Failed to create product.");
      }
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl space-y-6 p-10"
      >
        <h2 className="text-2xl text-center">
          {productId ? "Edit Product Info" : "Add New Product"}
        </h2>

        <div>
          <label className="ml-3">Product Name:</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="ml-3">Description:</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="ml-3">Price:</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="ml-3">Quantity:</label>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.quantity && (
            <p className="text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label className="ml-3">Categories:</label>
          <Controller
            control={control}
            name="categories"
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  options={categoryList}
                  isMulti
                  styles={{
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "#F4F4F5",
                      border: "1px solid",
                      borderColor: "#F4F4F5",
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                      },
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                        color: "#000000",
                      },
                    }),
                  }}
                  value={categoryList.filter((c) => value?.includes(c.value))}
                  onChange={(e) => onChange(e.map((c) => c.value))}
                />
              );
            }}
          />
          {errors.categories && (
            <p className="text-red-500">{errors.categories.message}</p>
          )}
        </div>

        <div>
          <label className="ml-3">Image:</label>
          {viewProductPicture && viewProductPicture !== "null" ? (
            <div>
              <Image
                src={viewProductPicture}
                alt="Product"
                className="w-32 h-32 object-cover"
              />
              <Button
                onClick={() => {
                  setValue("file", null);
                  setViewProductPicture(null);
                }}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <Input type="file" onChange={handleImageUpload} />
          )}
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}
        </div>
        <Link
          href={`/stores/${storeId}/dashboard`}
          className="mr-2 border border-gray-200 rounded px-4 py-2 hover:bg-gray-100 text-sm"
        >
          Cancel
        </Link>

        <Button
          type="submit"
          className="border border-gray-200 rounded hover:bg-gray-100 text-sm"
        >
          {productId ? "Save Changes" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
