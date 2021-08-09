import React, { Fragment, useState, useEffect } from "react";
import Order from "../api/order";
import { Table, PageHeader } from "antd";

/**
 * Formats a number to a currency string.
 * @return {String} formatted string
 */
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Order.getAllOrders((ords, err) => {
      if (!err) setOrders(ords);
    });
  }, []);

  const columns = [
    {
      title: "Ordered At",
      dataIndex: "order_date",
      key: "order_date",
    },
    {
      title: "Days Booked",
      dataIndex: "booking_qty",
      key: "booking_qty",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Paid With",
      dataIndex: "paid_with",
      key: "paid_with",
    },
  ];

  const data = orders.map((order) => ({
    key: order._id,
    order_date: new Date(order.createdAt).toDateString(),
    booking_qty: order.booking_qty,
    total: formatter.format(order.total / 100),
    paid_with: `Card ending in ${`${order.card_number}`.slice(-4)}`,
  }));

  return (
    <Fragment>
      <PageHeader
        className="site-page-header"
        backIcon={null}
        title="Orders"
        extra={[
          <strong>
            Earnings:{" "}
            {formatter.format(
              orders.map((x) => x.total).reduce((a, b) => a + b, 0) / 100
            )}
          </strong>,
        ]}
      />
      <Table columns={columns} dataSource={data} />
    </Fragment>
  );
};

export default Orders;
