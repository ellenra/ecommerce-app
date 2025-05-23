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
import CloseIcon from "@mui/icons-material/Close";

const Layout = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  const location = useLocation();

  const { cartItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Navbar maxWidth="full" className="p-4 bg-zinc-50">
        <div className="flex items-center space-x-3 md:hidden">
          <Button
            className="rounded hover:bg-zinc-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
          <NavbarBrand
            onClick={() => navigate("/")}
            className="hover:cursor-pointer"
          >
            <p className="font-bold text-inherit">DIGITAL</p>
          </NavbarBrand>
        </div>

        <NavbarBrand
          onClick={() => navigate("/")}
          className="hidden md:flex hover:cursor-pointer"
        >
          <p className="font-bold text-inherit">DIGITAL</p>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex space-x-2 items-center">
          <NavbarItem>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categories}
              className="w-44"
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
          <NavbarItem isActive className="flex-1">
            <Search
              setSearch={(search) => {
                navigate(
                  `/products?category=${selectedCategory.value}&search=${search}`
                );
              }}
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="flex space-x-2 items-center">
          <NavbarItem>
            <Link href="/cart" className="hidden sm:flex items-center">
              <ShoppingCartIcon />{" "}
              <p className="text-xs font-bold absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                {cartItems.length}
              </p>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/stores/create" className="hidden sm:flex items-center">
              <StorefrontIcon />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/profile/account"
              className="hidden sm:flex items-center"
            >
              <PersonOutlineIcon />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/cart" className="flex sm:hidden items-center">
              <ShoppingCartIcon />{" "}
              <p className="text-xs font-bold absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                {cartItems.length}
              </p>
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

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-4 border-zinc-200">
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categories}
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

          <Search
            className="w-full"
            setSearch={(search) => {
              navigate(
                `/products?category=${selectedCategory.value}&search=${search}`
              );
            }}
          />

          <Link href="/stores/create" className="flex justify-center">
            <StorefrontIcon />
          </Link>

          <Link href="/profile/account" className="flex justify-center">
            <PersonOutlineIcon />
          </Link>
        </div>
      )}

      <main className="flex-grow">
        <Outlet />{" "}
      </main>
      <div>
        <footer className="p-4 text-center bg-zinc-50">
          <p>DIGITAL</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
