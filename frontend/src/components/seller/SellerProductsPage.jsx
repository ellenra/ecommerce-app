import { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";

const SellerProductsPage = ({ store }) => {
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All",
  });
  const navigate = useNavigate();
  const location = useLocation();

  if (!store) {
    return <div>No store found.</div>;
  }

  useEffect(() => {
    if (location.state && location.state.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
  }, [location.state]);

  const filteredProducts =
    statusFilter.label === "All"
      ? store.products
      : store.products.filter((product) =>
          statusFilter.label === "Listed" ? product.isActive : !product.isActive
        );

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "listed", label: "Listed" },
    { value: "unlisted", label: "Unlisted" },
  ];

  const handleStatusChange = (selectedOption) => {
    setStatusFilter(selectedOption);
  };

  return (
    <div className="flex flex-col">
      <Select
        value={statusFilter}
        onChange={handleStatusChange}
        options={statusOptions}
        className="w-36 mt-4 mb-4"
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
      />
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            shadow="sm"
            className="hover:shadow-lg rounded-lg bg-white"
          >
            <CardBody
              onClick={() => {
                navigate(`/stores/${product.storeId}/products/${product.id}`, {
                  state: { from: `/stores/${store.id}/products`, statusFilter },
                });
              }}
              className="p-0 hover:cursor-pointer"
            >
              <Image
                alt={product.name}
                src={product.imageUrl}
                height={200}
                width={200}
                className="object-cover"
              />
            </CardBody>
            <CardFooter
              className="text-small justify-between hover:cursor-pointer"
              onClick={() => {
                navigate(`/stores/${product.storeId}/products/${product.id}`, {
                  state: { from: `/stores/${store.id}/products`, statusFilter },
                });
              }}
            >
              <b>{product.name}</b>
              <div className="flex items-center">
                <p>{product.price} $</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerProductsPage;
