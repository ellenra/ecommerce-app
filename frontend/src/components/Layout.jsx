import { useEffect, useState } from "react";
import { Link, Button } from "@nextui-org/react";
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
        const fetchedCategories = categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));

        setCategories([
          { value: "1", label: "All Categories" },
          ...fetchedCategories,
        ]);
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
    <div className="flex flex-col min-h-screen font-inter">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <nav className="border border-b-[#ececec]">
        <div className="max-w-7xl mx-auto  flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3 md:hidden">
            <Button
              className="rounded hover:bg-zinc-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
            <div onClick={() => navigate("/")} className="hover:cursor-pointer">
              <p className="text-xl text-inherit">DIGITRA</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/")}
            className="hidden md:flex md:ml-8 hover:cursor-pointer"
          >
            <p className="text-xl text-inherit">DIGITRA</p>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 mx-24">
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
                control: (base) => ({
                  ...base,
                  borderColor: "e2e2e2",
                  padding: "2px",
                }),
              }}
              components={{
                DropdownIndicator: () => <MenuIcon className="mr-2" />,
              }}
            />
            <div className="flex-1">
              <Search
                setSearch={(search) => {
                  navigate(
                    `/products?category=${
                      selectedCategory?.value || ""
                    }&search=${search}`
                  );
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="hidden sm:flex items-center">
              <ShoppingCartIcon />{" "}
              <p className="text-xs font-bold absolute top-0 right-0 transform translate-x-1 -translate-y-2">
                {cartItems.length}
              </p>
            </Link>
            <Link href="/stores/ad" className="hidden sm:flex items-center">
              <StorefrontIcon />
            </Link>
            <Link
              href="/profile/account"
              className="hidden sm:flex items-center"
            >
              <PersonOutlineIcon />
            </Link>
            <Link href="/cart" className="flex sm:hidden items-center">
              <ShoppingCartIcon />{" "}
              <p className="text-xs font-bold absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                {cartItems.length}
              </p>
            </Link>
            {session ? (
              <>
                <Button onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <>
                <Link href="/login">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </nav>

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
                `/products?category=${
                  selectedCategory?.value || ""
                }&search=${search}`
              );
            }}
          />

          <Link href="/stores/ad" className="flex justify-center">
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
        <footer className="p-2 text-center border border-b-[#ececec]">
          <p>DIGITRA</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
