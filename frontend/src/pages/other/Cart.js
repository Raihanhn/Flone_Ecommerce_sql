import { Fragment, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { CartContext } from "../../cartcontext/CartContext";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Cart = () => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getTotalCost,
    clearCart,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const handleIncrease = (product) => {
    updateCartQuantity(product.ID, product.quantity + 1);
  };

  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      updateCartQuantity(product.ID, product.quantity - 1);
    } else {
      removeFromCart(product.ID);
    }
  };

  const handleRemove = (product) => {
    removeFromCart(product.ID);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleProceedToPayment = () => {
    navigate("/checkout");
  };

  const [isHovered, setIsHovered] = useState(false);

  const totalCost = getTotalCost();
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Cart page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cart.length ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((product, index) => (
                            <tr key={`${product.ID}-${index}`}>
                              <td className="product-thumbnail">
                                <img
                                  className="img-fluid"
                                  src={`http://localhost:3001${product.image}`}
                                  alt={product.name}
                                />
                              </td>

                              <td className="product-name">
                                <span>{product.name}</span>
                              </td>

                              <td className="product-price-cart">
                                <span className="amount">${product.price}</span>
                              </td>

                              <td className="product-quantity">
                                <div className="cart-plus-minus">
                                  <button
                                    className="dec qtybutton"
                                    onClick={() => handleDecrease(product)}
                                  >
                                    -
                                  </button>
                                  <input
                                    className="cart-plus-minus-box"
                                    type="text"
                                    value={product.quantity}
                                    readOnly
                                  />
                                  <button
                                    className="inc qtybutton"
                                    onClick={() => handleIncrease(product)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="product-subtotal">
                                ${(product.price * product.quantity).toFixed(2)}
                              </td>

                              <td className="product-remove">
                                <button onClick={() => handleRemove(product)}>
                                  <i className="fa fa-times"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to="/">Continue Shopping</Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={handleClearCart}>
                          Clear Shopping Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="cart-tax">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Estimate Shipping And Tax
                        </h4>
                      </div>
                      <div className="tax-wrapper">
                        <p>
                          Enter your destination to get a shipping estimate.
                        </p>
                        <div className="tax-select-wrapper">
                          <div className="tax-select">
                            <label>* Country</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Region / State</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Zip/Postal Code</label>
                            <input type="text" />
                          </div>
                          <button className="cart-btn-2" type="submit">
                            Get A Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5>
                        Total products <span>${totalCost.toFixed(2)}</span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Grand Total <span>${totalCost.toFixed(2)}</span>
                      </h4>
                      <button
                        className=" custom-btn"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                          backgroundColor: isHovered ? "#333" : "#A749FF",
                          padding: "13px 42px 12px",
                          fontSize: "15px",
                          fontWeight: "500",
                          border: "none",
                          borderRadius: "50px",
                          color: "#fff",
                          transition: "all 0.3s ease 0s",
                        }}
                        type="submit"
                        onClick={handleProceedToPayment}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />
                      <Link to="/shop-grid-standard">Shop Now</Link>
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

export default Cart;
