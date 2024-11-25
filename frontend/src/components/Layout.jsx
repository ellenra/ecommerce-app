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

  //TODO: move this elsewhere
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className=" bg-zinc-100">
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
          {user ? (
            <NavbarContent justify="end">
              <NavbarItem className="hidden lg:flex">
                <Link href="/profile">Profile</Link>
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
      </div>

      <main className="flex-grow p-4">
        <Outlet />{" "}
      </main>
      <div>
        <footer className="p-4 text-center bg-zinc-100">
          <p>best app</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
