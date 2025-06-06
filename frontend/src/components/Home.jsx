import { useEffect, useState } from "react";
import { Card, CardBody, Image, Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import productservice from "../services/productservice";
import userservice from "../services/userservice";
import { useAuth } from "../hooks/AuthContext";

const Home = () => {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

    fetchUserData();
  }, [session]);

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

    const fetchProducts = async () => {
      try {
        const response = await productservice.getProducts();
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <>
      <div className="container max-w-7xl mx-auto text-center py-24 px-4">
        <h1 className="text-5xl">
          Discover, Buy and Sell Digital Products Effortlessly
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Explore a wide variety of digital products from the best and most
          trusted creators.
        </p>

        <Button
          className="mt-8 text-white bg-black hover:bg-white hover:text-black hover:border hover:border-black rounded-lg px-6 py-2"
          onClick={() => navigate("/products")}
        >
          Browse All Products
        </Button>
        <Button
          className="mt-8 ml-4 bg-white border border-black hover:bg-black hover:text-white rounded-lg px-6 py-2"
          onClick={() => navigate("/stores/create")}
        >
          Become a seller
        </Button>
      </div>

      <section className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Popular Categories</h2>
          <Button
            onClick={() => navigate("/products")}
            className="hover:bg-zinc-100 rounded-lg px-4 py-2"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => (
            <div
              key={category.value}
              className="group flex justify-center p-2 rounded-md border border-b-[#ececec]"
            >
              <Card className="hover:cursor-pointer">
                <CardBody
                  onClick={() =>
                    navigate(`/products?category=${category.value}`)
                  }
                >
                  <p className="overflow-hidden text-ellipsis text-lg">
                    {category.label}
                  </p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="container max-w-7xl mx-auto mt-6 mb-10 px-4">
        <h2 className="text-2xl pt-6 pb-4">Best Sellers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 pb-10">
          {products.map((product) => (
            <Card
              key={product.id}
              isPressable
              className="rounded-sm"
              onPress={() =>
                navigate(`/stores/${product.storeId}/products/${product.id}`)
              }
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  alt={product.name}
                  src={product.imageUrl}
                  className="object-cover w-full h-full"
                  removeWrapper
                />
              </div>
              <CardBody>
                <h3>{product.name}</h3>
                <p className="text-sm">{product.price}€</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 bg-zinc-100">
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-10">
            What Is DIGITRA?
          </h2>
          <p>
            DIGITAL is a global online marketplace where... Lorem ipsum dolor,
            sit amet consectetur adipisicing elit. Accusamus facilis non ad
            saepe rem id iure magnam, similique ullam, aspernatur error nisi
            veritatis temporibus culpa ex asperiores, numquam maiores?
            Dignissimos.
          </p>
        </div>
      </section>

      <section className="py-20 bg-black text-white text-center items-center">
        <div className="container mx-auto">
          <p className="mb-6 text-xl">
            Be the first to find out about exclusive offers, new trends and top
            creators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-md w-80 text-white"
            />
            <Button className="bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white px-6 py-2 rounded-md">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
