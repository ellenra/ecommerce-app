import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import orderservice from "../../services/orderservice";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const session = useAuth();
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session.user) return;

      try {
        const response = await orderservice.getOrdersByUserId(session.user.id);
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, [session]);

  if (!orders) {
    return;
  }

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableColumn>Order Number</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Order Date</TableColumn>
          <TableColumn>Total</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() =>
                navigate(`/orders/${order.id}`, { state: { order } })
              }
              className="hover:bg-zinc-100 cursor-pointer"
            >
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {order.status === "PENDING" ? "PROCESSING" : order.status}
              </TableCell>
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

export default OrdersPage;
