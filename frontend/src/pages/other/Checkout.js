import { Fragment, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { CartContext } from "../../cartcontext/CartContext";

const Checkout = () => {
  const { cart, getTotalCost, checkout } = useContext(CartContext);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const totalCost = getTotalCost();

  useEffect(() => {
    const { name, address, city, postalCode, country } = shippingInfo;
    const isShippingInfoValid =
      name && address && city && postalCode && country;
    const isPaymentMethodValid = paymentMethod !== "";
    setIsFormValid(isShippingInfoValid && isPaymentMethodValid);
  }, [shippingInfo, paymentMethod]);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "shipping") {
      setShippingInfo({ ...shippingInfo, [name]: value });
    } else if (type === "payment") {
      setPaymentMethod(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert(
        "Please fill in all the required fields and select a payment method."
      );
      return;
    }
    try {
      await checkout(shippingInfo, paymentMethod);
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout"
        description="Checkout page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cart.length > 0 ? (
              <div className="row">
                <div className="col-lg-7">
                  <form onSubmit={handleSubmit}>
                    <div className="billing-info-wrap">
                      <h3>Billing Details</h3>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Full Name</label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Full Name"
                              value={shippingInfo.name}
                              onChange={(e) => handleInputChange(e, "shipping")}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Address</label>
                            <input
                              type="text"
                              name="address"
                              placeholder="Address"
                              value={shippingInfo.address}
                              onChange={(e) => handleInputChange(e, "shipping")}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Town / City</label>
                            <input
                              type="text"
                              name="city"
                              placeholder="City"
                              value={shippingInfo.city}
                              onChange={(e) => handleInputChange(e, "shipping")}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>State / County</label>
                            <input
                              type="text"
                              name="country"
                              placeholder="Country"
                              value={shippingInfo.country}
                              onChange={(e) => handleInputChange(e, "shipping")}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Postcode / ZIP</label>
                            <input
                              type="text"
                              name="postalCode"
                              placeholder="Postal Code"
                              value={shippingInfo.postalCode}
                              onChange={(e) => handleInputChange(e, "shipping")}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cart.map((product) => {
                              return (
                                <li key={product.ID}>
                                  <span className="order-middle-left">
                                    {product.name} X {product.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    $
                                    {(product.price * product.quantity).toFixed(
                                      2
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>${totalCost.toFixed(2)}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method">
                        <h3>Payment Information</h3>
                        <select
                          className="me-2"
                          value={paymentMethod}
                          onChange={(e) => handleInputChange(e, "payment")}
                          required
                        >
                          <option value="">Select delivery option</option>
                          <option value="Cash on delivery">
                            Cash on delivery
                          </option>
                          <option value="Pay by Card">Pay by Card</option>
                        </select>
                      </div>
                    </div>
                    <div className="place-order mt-25">
                      <button
                        className="btn-hover"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/"}>Shop Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
