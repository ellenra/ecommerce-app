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
import { useUser } from "../UserContext";
import supabase from "../supabaseClient";

const Layout = () => {
  const user = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <div className="flex flex-col h-screen">
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
            <Link href="#" aria-current="page">
              Products
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/favorites">
              Favorites
            </Link>
          </NavbarItem>
        </NavbarContent>
        {user ? (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/store">Create store</Link>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button onClick={handleLogout}>Log out</Button>
            </NavbarItem>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/register">Sign up</Link>
            </NavbarItem>
          </NavbarContent>
        )}
      </Navbar>
      <main className="flex-grow p-4">
        <Outlet />{" "}
      </main>
      <footer className="p-4 text-center">
        <p>© 2024 My App</p>
      </footer>
    </div>
  );
};

export default Layout;
