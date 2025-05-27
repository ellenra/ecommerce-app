import { useState, useEffect } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import ProductTable from "../ProductTable";

const SellerProductsPage = ({ store, session }) => {
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All",
  });
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
    <div className="flex flex-col px-4">
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
      <ProductTable
        products={filteredProducts}
        session={session}
        like={false}
      />
    </div>
  );
};

export default SellerProductsPage;
