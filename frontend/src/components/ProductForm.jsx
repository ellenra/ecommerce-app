import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Image } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import storeservice from "../services/storeservice";
import { useAuth } from "../hooks/AuthContext";

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
  file: z.instanceof(File, { message: "Image is required" }),
});

const ProductForm = () => {
  const session = useAuth();
  const { storeId, productId } = useParams();
  const [viewProductPicture, setViewProductPicture] = useState(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const file = watch("file");

  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        try {
          const productData = await storeservice.getProduct(productId);
          setValue("name", productData.name);
          setValue("description", productData.description);
          setValue("price", productData.price);
          setValue("quantity", productData.quantity);
          setValue("categoryId", productData.categoryId);
          setValue("imageUrl", productData.imageUrl);
          setViewProductPicture(productData.imageUrl);
        } catch (error) {
          console.error("Error fetching product data:", error.message);
        }
      };

      fetchProductData();
    }
  }, [productId]);

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
      const { name, description, price, quantity, file } = data;
      if (productId) {
        formData.append("productId", productId);
      }
      formData.append("userId", session.user.id);
      formData.append("storeId", storeId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("categoryId", "1");
      if (file instanceof File) {
        formData.append("file", file);
      } else {
        formData.append("imageUrl", viewProductPicture);
      }
      if (productId) {
        await storeservice.updateProduct(formData);
        navigate(`/stores/${storeId}/products/${productId}`);
      } else {
        await storeservice.listProduct(formData);
        navigate(`/stores/${storeId}`);
      }
    } catch (error) {
      console.error("Error listing product:", error.message);
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

        <Button type="submit">
          {productId ? "Save Changes" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
