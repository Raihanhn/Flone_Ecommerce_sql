import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import { useCart } from "../../cartcontext/CartContext";

const IconGroup = ({ iconWhiteClass }) => {
  const { getCartCount, user, logout } = useCart();
  const cartCount = getCartCount();
  const { compareItems } = useSelector((state) => state.compare);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  // State for toggling dropdowns
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    if (offcanvasMobileMenu) {
      offcanvasMobileMenu.classList.add("active");
    }
  };

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)}>
      <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={toggleSearch}>
          <i className="pe-7s-search" />
        </button>
        <div className={clsx("search-content", { active: isSearchOpen })}>
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={toggleAccountDropdown}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div
          className={clsx("account-dropdown", {
            active: isAccountDropdownOpen,
          })}
        >
          {user ? (
            <ul>
              <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  My Account
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/myorders"}>My Order</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/searchoid"}>
                  Search OID
                </Link>
              </li>
              <li>
                <div style={{ cursor: "pointer" }} onClick={logout}>
                  Logout
                </div>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to={process.env.PUBLIC_URL + "/login"}>Login</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/register"}>Register</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/allorders"}>
                  All Orders
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/allusers"}>All Users</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems ? compareItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      <Link
        to={process.env.PUBLIC_URL + "/cart"}
        className="same-style cart-wrap d-none d-lg-block"
      >
        <button className="icon-cart">
          <i className="pe-7s-shopbag" />
          <span className="count-style">{cartCount}</span>
        </button>
      </Link>

      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};

export default IconGroup;
