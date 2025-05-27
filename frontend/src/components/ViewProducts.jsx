import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";
import productservice from "../services/productservice";
import ProductTable from "./ProductTable";

const ViewProducts = () => {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    label: "All Categories",
    value: "",
  });
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");
  const categoryQuery = new URLSearchParams(location.search).get("category");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      try {
        const fetchedUser = await userservice.getUser(
          session.user.id,
          session.access_token
        );
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await productservice.getProductCategories();
        setCategories(
          categories.map((cat) => ({ value: cat.id, label: cat.name }))
        );
      } catch (error) {
        console.error("Error fetching categories", error.message);
      }
    };

    fetchCategories();
    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (!categoryQuery || categories.length === 0) return;

    if (selectedCategory.value !== categoryQuery) {
      const category = categories.find((cat) => cat.value === categoryQuery);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [categories, categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `http://localhost:5000/api/products?category=${
          selectedCategory.value || ""
        }&search=${searchQuery || ""}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {categoryQuery && (
        <p className="mb-6">
          {`Categories / ${
            categories.find((cat) => cat.value === categoryQuery)?.label
          }`}
        </p>
      )}
      <ProductTable
        products={products}
        session={session}
        user={user}
        setUser={setUser}
      />
    </div>
  );
};

export default ViewProducts;
