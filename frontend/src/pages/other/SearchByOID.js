import { Fragment, useEffect, useState } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { useCart } from "../../cartcontext/CartContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const SearchByOID = () => {
  const { user } = useCart();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (user) {
      axios
        .get(`http://localhost:3001/api/orders/${user.userId}/${orderId}`)
        .then((response) => {
          setOrder(response.data);
          setError("");
          setOrderId(""); // Clear the input after search
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          setOrder(null);
          setError("Order not found.");
          setOrderId(""); // Clear the input even if there's an error
        });
    }
  };

  if (!user)
    return (
      <p className="text-center mt-4">Please sign in to search for orders.</p>
    );
  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <div className="container mt-5">
          <h1 className="text-center mb-4">Search by Order ID</h1>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID"
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
              {error && <p className="text-danger">{error}</p>}
              {order && (
                <div className="card mt-4">
                  <div className="card-body">
                    <h5 className="card-title">Order Details</h5>
                    <p>
                      <strong>Order ID:</strong> {order.oid}
                    </p>
                    <p>
                      <strong>User Name:</strong> {order.userName}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.address}
                    </p>
                    <p>
                      <strong>City:</strong> {order.city}
                    </p>
                    <p>
                      <strong>Zip:</strong> {order.zip}
                    </p>
                    <p>
                      <strong>Country:</strong> {order.country}
                    </p>
                    <p>
                      <strong>Product Name:</strong> {order.productName}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Payment Type:</strong> {order.payment_type}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.total}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default SearchByOID;
