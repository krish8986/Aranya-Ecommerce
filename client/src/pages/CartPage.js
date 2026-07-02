import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
// import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
// import { AiFillWarning } from "react-icons/ai";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  // const [clientToken, setClientToken] = useState("");
  // const [instance, setInstance] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total cart price-----
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


  // Remove item from cart--
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
  // const getToken = async () => {
  // try {
  // const { data } = await axios.get("/api/v1/product/braintree/token");
  // if (data?.clientToken) {
  // setClientToken(data.clientToken);
  // } else {
  // toast.error("Failed to load payment gateway. Try again.");
  // }
  // } catch (error) {
  // console.error("Error fetching Braintree token:", error);
  // toast.error("Failed to load payment gateway. Try again.");
  // }
  // };

  // useEffect(() => {
  // if (auth?.token) getToken();
  // }, [auth?.token]);



  // Handle payment---

  // const handlePayment = async () => {
  // if (!instance) {
  // toast.error("Payment UI not loaded. Try again.");
  // return;
  // }

  // try {
  // setLoading(true);
  // const { nonce } = await instance.requestPaymentMethod();

  // const { data } = await axios.post("/api/v1/product/braintree/payment", {
  // nonce,
  // cart,
  // });

  // setLoading(false);
  // setCart([]);
  // localStorage.removeItem("cart");
  // toast.success("Payment Completed Successfully!");
  // navigate("/dashboard/user/orders");
  // } catch (error) {
  // console.error("Payment error:", error);
  // toast.error("Payment failed. Try again.");
  // setLoading(false);
  // }
  // };


  //handle payment for razorpay----

  // const handlePayment = async () => {
  // try {
  // const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/payment/create-order`, {
  // amount: cart.reduce((acc, item) => acc + item.price, 0)
  // });
  // 
  // const options = {
  // key: process.env.REACT_APP_RAZORPAY_KEY,
  // amount: data.order.amount,
  // currency: "INR",
  // name: "Aranya",
  // description: "Order Payment",
  // order_id: data.order.id,
  // handler: function (response) {
  // toast.success("Payment Successful!");
  // console.log(response);
  // setCart([]);
  // localStorage.removeItem("cart");
  // navigate("/dashboard/user/orders");
  // },
  // prefill: {
  // name: auth?.user?.name,
  // email: auth?.user?.email,
  // contact: "9999999999"
  // },
  // theme: {
  // color: "#3399cc"
  // }
  // };
  // 
  // const razor = new window.Razorpay(options);
  // razor.open();
  // 
  // } catch (error) {
  // console.log(error);
  // toast.error("Payment Failed!");
  // }
  // };


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  //handlerazorpay---

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
        description: "Test Transaction",
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
                {
                  headers: {
                    Authorization: auth?.token,
                  },
                }
              );

              setCart([]);
              localStorage.removeItem("cart");
              toast.success("Payment successful!");
              navigate("/payment-success");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Order save error:", err);
            toast.error("Order could not be saved.");
          }
        },
        prefill: {
          name: auth?.user?.name,
          email: auth?.user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    // <Layout>
    <Layout
      title={"Your Cart | Aranya"}
      description={"View and manage your cart. Shop biodegradable and sustainable products from Aranya easily."}
      keywords={"aranya cart, eco-friendly shopping, biodegradable products, view cart"}
      author={"Krishna Kumar"}
    >
      <div className="cart-page container">
        <div className="row">
          <div className="col-md-12 text-center p-2 mb-3">
            <h2><b><i>Hello {auth?.user?.name || "Guest"}</i></b></h2>
            <p>
              {cart?.length
                ? `You have ${cart.length} item(s) in your cart ${auth?.token ? "" : "— please login to checkout!"
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
                    loading="lazy"
                  />
                </div>
                <div className="col-md-4">
                  <p><b>{item.name}</b></p>
                  <p>{item.description?.substring(0, 30)}...</p>
                  <p>Price: <b>₹{item.price}</b></p>
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
            <h4>Total: <b>{totalPrice()}</b></h4>

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
            {/* {clientToken && cart?.length > 0 && auth?.token ? ( 
              {/* // <div className="mt-3"> */}
            {/* // <DropIn 
                  // options={{
                    */}
            {/* authorization: clientToken,
                    // paypal: { flow: "vault" },
                  // }}
                  // onInstance={(instance) => setInstance(instance)}
                // />*/}
            {/* <button */}
            {/* // className="btn btn-primary mt-3" */}
            {/* // onClick={handlePayment} */}
            {/* // disabled={loading || !instance} */}
            {/* // > */}
            {/* // {loading ? "Processing..." : "Make Payment"} */}
            {/* // </button> */}
            {/* // </div> */}
            {/* // ) : ( */}
            {/* // <div className="text-danger mt-3"> */}
            {/* // <AiFillWarning size={20} /> Payment system not ready */}
            {/* // </div> */}
            {/* // )} */}

            {/* Razorpay Payment Button */}
            {cart?.length > 0 && auth?.token ? (
              <button
                className="btn btn-checkout"
                onClick={handleRazorpayPayment}
              >
                Make Payment
              </button>
            ) : (
              <div className="text-danger mt-3">
                Please login or add items to cart to proceed.
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;




