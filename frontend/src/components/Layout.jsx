import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import Select from "react-select";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "../supabaseClient";
import { useCart } from "../hooks/CartContext";
import { useAuth } from "../hooks/AuthContext";
import Search from "./Search";
import productservice from "../services/productservice";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  const location = useLocation();

  const { cartItems } = useCart();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category") || "";
    setSelectedCategory(
      categories.find((cat) => cat.value === category) || null
    );
  }, [location.search, selectedCategory]);

  useEffect(() => {
    if (!location.pathname.startsWith("/products")) {
      setSelectedCategory(null);
    }
  }, [location]);

  useEffect(() => {
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
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);

    if (selectedOption && selectedOption.value) {
      navigate(`/products?category=${selectedOption.value}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-zinc-50">
        <Navbar maxWidth="full" className="p-4">
          <NavbarBrand
            onClick={() => navigate("/")}
            className="hover:cursor-pointer"
          >
            <p className="font-bold text-inherit">ECOMMERCE APP</p>
          </NavbarBrand>

          <NavbarContent>
            <NavbarItem className="mt-4">
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categories}
                className="w-36 mb-4"
                placeholder="Categories"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  indicatorSeparator: () => null,
                  control: (base, state) => ({
                    ...base,
                    borderColor: "e2e2e2",
                    borderRadius: "6px",
                    padding: "2px",
                  }),
                }}
                components={{
                  DropdownIndicator: () => <MenuIcon className="mr-2" />,
                }}
              />
            </NavbarItem>
            <NavbarItem isActive>
              <Search
                setSearch={(search) => {
                  navigate(
                    `/products?category=${selectedCategory.value}&search=${search}`
                  );
                }}
              />
            </NavbarItem>
            <NavbarItem>
              <Button className="border rounded-lg bg-white hover:bg-zinc-100 hover:border-zinc-300">
                <Link color="foreground" href="/products">
                  Products
                </Link>
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button className="border bg-white rounded-lg hover:bg-zinc-100 hover:border-zinc-300">
                <Link color="foreground" href="/stores">
                  Stores
                </Link>
              </Button>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem>
              <Link href="/cart" className="flex items-center">
                <ShoppingCartIcon />{" "}
                <p className="text-xs font-bold absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  {cartItems.length}
                </p>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/stores/create" className="flex items-center">
                <StorefrontIcon />
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/profile/account" className="flex items-center">
                <PersonOutlineIcon />
              </Link>
            </NavbarItem>
            {session ? (
              <>
                <NavbarItem>
                  <Button onClick={handleLogout}>Log out</Button>
                </NavbarItem>
              </>
            ) : (
              <>
                <NavbarItem>
                  <Link href="/login">Sign in</Link>
                </NavbarItem>
              </>
            )}
          </NavbarContent>
        </Navbar>
      </div>

      <main className="flex-grow">
        <Outlet />{" "}
      </main>
      <div>
        <footer className="p-4 text-center bg-zinc-50">
          <p>Ecommerce App</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
