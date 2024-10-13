import { Fragment, useEffect, useState } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { useCart } from "../../cartcontext/CartContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const MyOrders = () => {
  const { user } = useCart();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3001/api/orders/${user.userId}`)
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-4">Please sign in to view your orders.</p>
    );

  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <div className="container mt-5">
          <h1 className="text-center mb-4">My Orders</h1>
          {orders.length === 0 ? (
            <p className="text-center">You have no orders.</p>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <ul className="list-group">
                  {orders.map((order) => (
                    <li key={order.oid} className="list-group-item mb-3">
                      <h5 className="mb-3">Order ID: {order.oid}</h5>
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
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyOrders;
