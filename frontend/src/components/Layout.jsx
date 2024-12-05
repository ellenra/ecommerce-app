import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "../supabaseClient";
import { useCart } from "../hooks/CartContext";
import { useAuth } from "../hooks/AuthContext";

const Layout = () => {
  const session = useAuth();
  const { cartItems } = useCart();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className=" bg-zinc-50">
        <Navbar>
          <NavbarBrand>
            <p className="font-bold text-inherit">STORE</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="/stores">
                Stores
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="/" aria-current="page">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/favorites">
                Favorites
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Link href="/cart">Cart: {cartItems.length}</Link>
            </NavbarItem>
            {session.user ? (
              <>
                <NavbarItem>
                  <Link href="/profile">Profile</Link>
                </NavbarItem>
                <NavbarItem>
                  <Button onClick={handleLogout}>Log out</Button>
                </NavbarItem>
              </>
            ) : (
              <>
                <NavbarItem>
                  <Link href="/login">Login</Link>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/register">Sign up</Link>
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
