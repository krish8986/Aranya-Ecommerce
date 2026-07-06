import React, { useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      const total = cart?.reduce((acc, item) => acc + item.price, 0);
      return total.toLocaleString("en-IN", { style: "currency", currency: "INR" });
    } catch (error) {
      return "₹0";
    }
  };

  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpayPayment = async () => {
    try {
      const amount = cart.reduce((acc, item) => acc + item.price, 0);
      const { data: order } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/razorpay/order`,
        { amount }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Aranya E-commerce",
        description: "Eco-Friendly Products",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${process.env.REACT_APP_API}/api/v1/product/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            if (verifyRes.data.success) {
              await axios.post(
                `${process.env.REACT_APP_API}/api/v1/orders/create`,
                {
                  products: cart.map((item) => item._id),
                  payment: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    status: "Success",
                  },
                },
                { headers: { Authorization: auth?.token } }
              );
              setCart([]);
              localStorage.removeItem("cart");
              toast.success("Payment successful! 🌿");
              navigate("/payment-success");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Order could not be saved.");
          }
        },
        prefill: {
          name: auth?.user?.name,
          email: auth?.user?.email,
          contact: "9999999999",
        },
        theme: { color: "#2D6A4F" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <Layout
      title={"Your Cart | Aranya"}
      description={"View and manage your cart."}
      keywords={"aranya cart, eco-friendly shopping"}
      author={"Krishna Kumar"}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 style={{ color: "#1B4332", fontWeight: "700" }}>
            🛒 Hello, {auth?.user?.name || "Guest"}!
          </h2>
          <p style={{ color: "#6B7280" }}>
            {cart?.length
              ? `You have ${cart.length} item(s) in your cart`
              : "Your cart is empty 🌿"}
          </p>
        </div>

        {cart?.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "60px", marginBottom: "1rem" }}>🛒</div>
            <h4 style={{ color: "#6B7280" }}>Your cart is empty</h4>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "#1B4332",
                color: "#fff",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                marginTop: "1rem",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              🌿 Continue Shopping
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-md-8">
              {cart?.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    border: "1px solid #E9F5EE",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item?.photo?.url || `/api/v1/product/product-photo/${item._id}`}
                    alt={item.name}
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "10px" }}
                    loading="lazy"
                  />
                  <div style={{ flex: 1 }}>
                    <h6 style={{ fontWeight: "600", color: "#1A1A1A", marginBottom: "4px" }}>
                      {item.name}
                    </h6>
                    <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>
                      {item.description?.substring(0, 50)}...
                    </p>
                    <span style={{ color: "#2D6A4F", fontWeight: "700", fontSize: "15px" }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => removeCartItem(item._id)}
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      color: "#DC2626",
                      borderRadius: "8px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-md-4">
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                border: "1px solid #E9F5EE",
                position: "sticky",
                top: "90px",
              }}>
                <h5 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "1.25rem" }}>
                  Order Summary
                </h5>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Items ({cart.length})</span>
                  <span style={{ fontWeight: "600" }}>{totalPrice()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Delivery</span>
                  <span style={{ color: "#2D6A4F", fontWeight: "600" }}>Free 🌿</span>
                </div>

                <hr style={{ borderColor: "#E9F5EE" }} />

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <span style={{ fontWeight: "700", fontSize: "16px" }}>Total</span>
                  <span style={{ fontWeight: "700", fontSize: "16px", color: "#1B4332" }}>{totalPrice()}</span>
                </div>

                {/* Address */}
                {auth?.user?.address ? (
                  <div style={{
                    background: "#F8FAF9",
                    borderRadius: "10px",
                    padding: "0.85rem",
                    marginBottom: "1rem",
                    border: "1px solid #E9F5EE",
                  }}>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>
                      DELIVERY ADDRESS
                    </div>
                    <div style={{ fontSize: "13px", color: "#374151" }}>{auth.user.address}</div>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#2D6A4F",
                        fontSize: "12px",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: "500",
                        marginTop: "4px",
                      }}
                    >
                      Change address →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(auth?.token ? "/dashboard/user/profile" : "/login")}
                    style={{
                      width: "100%",
                      background: "#F8FAF9",
                      border: "1.5px dashed #52B788",
                      color: "#2D6A4F",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    + {auth?.token ? "Add Delivery Address" : "Login to Checkout"}
                  </button>
                )}

                {/* Pay Button */}
                {cart?.length > 0 && auth?.token && (
                  <button
                    onClick={handleRazorpayPayment}
                    style={{
                      width: "100%",
                      background: "#1B4332",
                      border: "none",
                      color: "#fff",
                      borderRadius: "12px",
                      padding: "0.85rem",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => e.target.style.background = "#2D6A4F"}
                    onMouseOut={(e) => e.target.style.background = "#1B4332"}
                  >
                    🔒 Pay {totalPrice()}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;