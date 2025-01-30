import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { Outlet, useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "../supabaseClient";
import { useCart } from "../hooks/CartContext";
import { useAuth } from "../hooks/AuthContext";
import Search from "./Search";

const Layout = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { cartItems } = useCart();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      navigate("/", { replace: true });
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
            <NavbarItem isActive>
              <Search
                setSearch={(search) => navigate(`/products?search=${search}`)}
              />
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/products">
                Products
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/stores">
                Stores
              </Link>
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
              <Link href="/stores/ad" className="flex items-center">
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

      <main className="flex-grow p-4">
        <Outlet />{" "}
      </main>
      <div>
        <footer className="p-4 text-center bg-zinc-50">
          <p>best app</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
