import React, { useState } from "react";
import { useUser } from "../UserContext";
import { Button, Input } from "@nextui-org/react";
import productService from "../services/productservice";
import { useNavigate, useParams } from "react-router-dom";

const ListProductForm = () => {
  const user = useUser();
  const { storeId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
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
      setName("");
      setDescription("");
      setPrice(0);
      setQuantity(0);
      setImage(null);
      navigate(`/stores/${storeId}`);
    } catch (exception) {
      console.log("error in listing product", exception.message);
    }
  };

  return (
    <div>
      <>
        <form onSubmit={handleListProduct}>
          <div>
            Product Name:
            <Input
              type="text"
              label="Product Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            Description:
            <Input
              type="text"
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>
          <div>
            Price:
            <Input
              type="number"
              step="any"
              label="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>
          <div>
            Quantity:
            <Input
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>
          <div>
            Image Url:
            <Input type="file" name="file" onChange={handleImageUpload} />
          </div>
          <Button type="submit">List Product</Button>
        </form>
      </>
    </div>
  );
};

export default ListProductForm;
