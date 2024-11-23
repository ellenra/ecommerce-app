import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";
import { Button, Input } from "@nextui-org/react";
import productService from "../services/productservice";

const ListProductForm = ({ storeId }) => {
  const user = useUser();
  const [store, setStore] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  console.log(storeId);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`/api/stores/${storeId}`);
        setStore(response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStore();
  }, [storeId]);

  if (!store) {
    return <div>Loading...</div>;
  }

  const isOwner = user && user.id === store.userId;

  const handleListProduct = async (event) => {
    event.preventDefault();
    try {
      const newProduct = await productService.listProduct({
        userId: user.id,
        storeId,
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        imageUrl,
        categoryId,
      });
      setName("");
      setDescription("");
      setPrice(0);
      setQuantity(0);
      setImageUrl("");
    } catch (exception) {
      console.log("error in listing product", exception.message);
    }
  };

  return (
    <div>
      <h1>{store.name}</h1>
      <p>{store.description}</p>
      <p>Category: {store.category}</p>

      {isOwner && (
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
              <Input
                type="text"
                label="Image"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </div>
            <Button type="submit">List Product</Button>
          </form>
          <Link to={`/stores/${storeId}/manage`}>
            <button>Manage Your Store</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default ListProductForm;
