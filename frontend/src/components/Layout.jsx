import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 text-center">
        <nav>
          <h1>My App</h1>
        </nav>
      </header>
      <div className="flex flex-grow">
        <aside className="bg-gray-100 p-4">
          <ul>
            <li>Dashboard</li>
          </ul>
        </aside>

        <main className="flex-grow p-4">
          <Outlet />{" "}
        </main>
      </div>
      <footer className="p-4 text-center">
        <p>© 2024 My App</p>
      </footer>
    </div>
  );
};

export default Layout;
