import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total cart price
  const totalPrice = () => {
    try {
      const total = cart?.reduce((acc, item) => acc + item.price, 0);
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.error("Error calculating total price:", error);
      return "₹0";
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  // Fetch client token for Braintree
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      if (data?.clientToken) {
        setClientToken(data.clientToken);
      } else {
        toast.error("Failed to load payment gateway. Try again.");
      }
    } catch (error) {
      console.error("Error fetching Braintree token:", error);
      toast.error("Failed to load payment gateway. Try again.");
    }
  };

  useEffect(() => {
    if (auth?.token) getToken();
  }, [auth?.token]);

  // Handle payment
  const handlePayment = async () => {
    if (!instance) {
      toast.error("Payment UI not loaded. Try again.");
      return;
    }

    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();

      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });

      setLoading(false);
      setCart([]);
      localStorage.removeItem("cart");
      toast.success("Payment Completed Successfully!");
      navigate("/dashboard/user/orders");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page container">
        <div className="row">
          <div className="col-md-12 text-center bg-light p-2 mb-3">
            <h2>Hello {auth?.user?.name || "Guest"}</h2>
            <p>
              {cart?.length
                ? `You have ${cart.length} item(s) in your cart ${
                    auth?.token ? "" : "— please login to checkout!"
                  }`
                : "Your cart is empty."}
            </p>
          </div>
        </div>

        <div className="row">
          {/* Cart Items */}
          <div className="col-md-7">
            {cart?.map((item) => (
              <div className="row card flex-row mb-3" key={item._id}>
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${item._id}`}
                    className="card-img-top"
                    alt={item.name}
                    width="100%"
                    height="130"
                  />
                </div>
                <div className="col-md-4">
                  <p>{item.name}</p>
                  <p>{item.description?.substring(0, 30)}...</p>
                  <p>Price: ₹{item.price}</p>
                </div>
                <div className="col-md-4 cart-remove-btn">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Payment */}
          <div className="col-md-5 cart-summary">
            <h3>Cart Summary</h3>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()}</h4>

            {/* Address Section */}
            {auth?.user?.address ? (
              <div className="mb-3">
                <h5>Current Address</h5>
                <p>{auth.user.address}</p>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-3">
                <button
                  className="btn btn-outline-warning"
                  onClick={() =>
                    navigate(auth?.token ? "/dashboard/user/profile" : "/login", {
                      state: "/cart",
                    })
                  }
                >
                  {auth?.token ? "Add Address" : "Login to Checkout"}
                </button>
              </div>
            )}

            {/* Braintree Payment DropIn */}
            {clientToken && cart?.length > 0 && auth?.token ? (
              <div className="mt-3">
                <DropIn
                  options={{
                    authorization: clientToken,
                    paypal: { flow: "vault" },
                  }}
                  onInstance={(instance) => setInstance(instance)}
                />
                <button
                  className="btn btn-primary mt-3"
                  onClick={handlePayment}
                  disabled={loading || !instance}
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              </div>
            ) : (
              <div className="text-danger mt-3">
                <AiFillWarning size={20} /> Payment system not ready
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
