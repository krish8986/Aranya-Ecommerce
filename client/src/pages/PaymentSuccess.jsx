import React, { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Redirect after 7 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Layout title="Payment Success - Aranya">
      {showConfetti && <Confetti />}
      <div
        style={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you for your order! We’ll process it shortly.</p>
        <p>Redirecting to homepage...</p>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
