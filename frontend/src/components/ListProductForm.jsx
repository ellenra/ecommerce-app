import React, { useState } from "react";
import { useUser } from "../UserContext";
import { Button, Input, Image } from "@nextui-org/react";
import productService from "../services/productservice";
import { useNavigate, useParams } from "react-router-dom";

const ListProductForm = () => {
  const user = useUser();
  const { storeId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("1");
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleListProduct = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("storeId", storeId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("categoryId", categoryId);
      if (image) {
        formData.append("file", image);
      }
      const newProduct = await productService.listProduct(formData);
      navigate(`/stores/${storeId}`);
    } catch (exception) {
      console.log("error in listing product", exception.message);
    }
  };

  return (
    <div>
      <>
        <form
          onSubmit={handleListProduct}
          className="w-full max-w-3xl space-y-6 p-10"
        >
          <h2 className="text-2xl text-center">Add new product</h2>

          <div>
            <label className="ml-3">Product name:</label>
            <Input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="ml-3">Description:</label>
            <Input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="ml-3">Price:</label>
            <Input
              type="number"
              step="any"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="ml-3">Quantity:</label>
            <Input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="ml-3">Image:</label>
            {image ? (
              <>
                <div className="mb-2 ml-3 mt-4">
                  <Image
                    shadow="sm"
                    radius="lg"
                    alt="Profile"
                    className="w-full object-cover h-[140px]"
                    src={URL.createObjectURL(image)}
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
                      setImage(null);
                    }}
                  >
                    Delete Image
                  </Button>
                </div>
              </>
            ) : (
              <Input type="file" name="file" onChange={handleImageUpload} />
            )}
          </div>
          <Button
            type="submit"
            className="ml-3 border border-gray-200 hover:bg-gray-100 rounded-lg"
          >
            Add Product
          </Button>
        </form>
      </>
    </div>
  );
};

export default ListProductForm;
