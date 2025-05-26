import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import orderservice from "../services/orderservice";

const StoreOwnerOrdersPage = ({ store }) => {
  const { session } = useAuth();
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderservice.getOrdersByStoreId(
          store.id,
          session.access_token
        );
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, [store.id]);

  if (!orders) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableColumn>Order Number</TableColumn>
          <TableColumn>Payment Status</TableColumn>
          <TableColumn>Order Date</TableColumn>
          <TableColumn>Total</TableColumn>
        </TableHeader>
        <TableBody>
          {" "}
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() =>
                navigate(`/stores/${store.id}/orders/${order.id}`, {
                  state: { session },
                })
              }
              className="hover:bg-zinc-100 cursor-pointer"
            >
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.total} $</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoreOwnerOrdersPage;
