import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie library

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      // Fetch user data if user ID cookie exists
      axios
        .get(`http://localhost:3001/api/user/${userId}`)
        .then((response) => {
          const { ID, name } = response.data;
          setUser({ userId: ID, name });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch user cart if user data is available
      axios
        .get(`http://localhost:3001/api/cart/${user.userId}`)
        .then((response) => {
          const fetchedCart = response.data;
          // Filter items with status other than 1
          const filteredCart = fetchedCart.filter((item) => item.status === 1);
          const aggregatedCart = filteredCart.reduce((acc, item) => {
            const existingProduct = acc.find((p) => p.ID === item.ID);
            if (existingProduct) {
              existingProduct.quantity += item.quantity;
            } else {
              acc.push({ ...item });
            }
            return acc;
          }, []);
          setCart(aggregatedCart);
        })
        .catch((error) => {
          console.error("Error fetching user cart:", error);
        });
    }
  }, [user]);

  const logout = () => {
    Cookies.remove("userId");
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    if (!user) return alert("Please sign in to add products to your cart.");

    axios
      .post("http://localhost:3001/api/cart", {
        user_id: user.userId,
        product_id: product.ID,
        quantity: 1,
      })
      .then(() => {
        setCart((prevCart) => {
          const existingProduct = prevCart.find(
            (item) => item.ID === product.ID
          );
          if (existingProduct) {
            return prevCart.map((item) =>
              item.ID === product.ID
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prevCart, { ...product, quantity: 1 }];
          }
        });
      })
      .catch((error) => console.error("Error adding to cart:", error));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (!user) return;

    axios
      .put("http://localhost:3001/api/cart", {
        user_id: user.userId,
        product_id: productId,
        quantity,
      })
      .then(() => {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.ID === productId ? { ...item, quantity } : item
          )
        );
      })
      .catch((error) => console.error("Error updating cart quantity:", error));
  };

  const removeFromCart = (productId) => {
    if (!user) return;

    axios
      .delete("http://localhost:3001/api/cart", {
        data: {
          user_id: user.userId,
          product_id: productId,
        },
      })
      .then(() => {
        setCart((prevCart) => prevCart.filter((item) => item.ID !== productId));
      })
      .catch((error) => console.error("Error removing from cart:", error));
  };

  const clearCart = () => {
    if (!user) return;

    axios
      .delete(`http://localhost:3001/api/cart/${user.userId}`)
      .then(() => {
        setCart([]);
      })
      .catch((error) => console.error("Error clearing cart:", error));
  };

  const getCartCount = () => {
    if (!Array.isArray(cart)) return 0; // Guard clause
    const uniqueProducts = new Set(cart.map((item) => item.ID));
    return uniqueProducts.size;
  };

  const getTotalCost = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = async (shippingInfo, paymentMethod) => {
    if (!user) throw new Error("User not logged in");

    const { name, address, city, postalCode, country } = shippingInfo;

    await axios.post("http://localhost:3001/api/checkout", {
      userId: user.userId,
      name,
      address,
      city,
      zip: postalCode,
      country,
      paymentMethod,
    });

    // Clear the cart locally
    setCart([]);
  };

  const proceedToPayment = async () => {
    if (!user) {
      alert("Please sign in to proceed to payment.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/user/cart/checkout/${user.userId}`
      );
      if (response.status === 200) {
        return true;
      } else {
        alert("Failed to proceed to payment. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      alert("Failed to proceed to payment. Please try again.");
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        getCartCount,
        getTotalCost,
        setUser,
        userId: user ? user.userId : null,
        checkout,
        proceedToPayment,
        logout,
        user,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
