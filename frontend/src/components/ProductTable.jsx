import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/favoriteProducts";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ProductTable = ({ products, session, user, setUser, like = true }) => {
  const navigate = useNavigate();
  const { addFavorite, deleteFavorite, isFavorite } = useFavorites(
    user,
    setUser
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="w-full hover:cursor-pointer">
            <div className="relative">
              <CardBody
                onClick={() =>
                  navigate(
                    `/stores/${product.storeId}/products/${product.id}`,
                    {
                      state: { from: "/products" },
                    }
                  )
                }
                className="p-0 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    alt={product.name}
                    src={product.imageUrl}
                    className="object-cover w-full h-full"
                    removeWrapper
                  />
                </div>
              </CardBody>
              {like && (
                <div className="absolute top-2 -right-2 z-20">
                  {session && isFavorite(product.id) ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        deleteFavorite(product.id, session.access_token)
                      }
                    >
                      <FavoriteIcon />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() =>
                        addFavorite(product.id, session?.access_token)
                      }
                    >
                      <FavoriteBorderIcon />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <CardFooter
              className="text-small flex flex-col items-start -ml-3"
              onClick={() =>
                navigate(`/stores/${product.storeId}/products/${product.id}`, {
                  state: { from: "/products" },
                })
              }
            >
              <p className="font-bold truncate block max-w-full">
                {product.name}
              </p>{" "}
              <div>
                <p>{product.price} $</p>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default ProductTable;
