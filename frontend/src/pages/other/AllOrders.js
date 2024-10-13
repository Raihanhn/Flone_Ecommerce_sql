import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import LayoutOne from "../../layouts/LayoutOne";
import "bootstrap/dist/css/bootstrap.min.css";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        <div className="container my-5">
          <h2 className="text-center mb-4">All Orders</h2>
          <div className="row">
            {orders.map((order) => (
              <div key={order.oid} className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Order ID: {order.oid}</h5>
                    <p className="card-text">User Name: {order.userName}</p>
                    <p className="card-text">Address: {order.address}</p>
                    <p className="card-text">City: {order.city}</p>
                    <p className="card-text">Zip: {order.zip}</p>
                    <p className="card-text">Country: {order.country}</p>
                    <p className="card-text">
                      Product Name: {order.productName}
                    </p>
                    <p className="card-text">Quantity: {order.quantity}</p>
                    <p className="card-text">
                      Payment Type: {order.payment_type}
                    </p>
                    <p className="card-text">Total Cost: ${order.total}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AllOrders;
