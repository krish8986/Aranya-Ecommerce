import React, { useState } from "react";
import Layout from "./../../components/Layouts/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GiTreeBranch } from "react-icons/gi";

const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [answer, setAnswer] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const inputStyle = {
        width: "100%",
        padding: "0.7rem 1rem",
        border: "1.5px solid #E9F5EE",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none",
        marginBottom: "1rem",
    };

    // Step 1 — Verify email + answer → get OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/forget-password`,
                { email, answer }
            );
            if (res.data.success) {
                toast.success("OTP sent to your email!");
                setStep(2);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — Verify OTP + reset password
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/forget-password`,
                { email, answer, otp, newPassword }
            );
            if (res.data.success) {
                toast.success("Password reset successfully!");
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title={"Reset Password | Aranya"}>
            <div style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F8FAF9",
                padding: "2rem",
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "2.5rem",
                    width: "100%",
                    maxWidth: "420px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                    border: "1px solid #E9F5EE",
                }}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <GiTreeBranch style={{ fontSize: "40px", color: "#2D6A4F", marginBottom: "8px" }} />
                        <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>
                            {step === 1 ? "Reset Password" : "Enter OTP"}
                        </h4>
                        <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>
                            {step === 1
                                ? "Enter your email and security answer"
                                : "Check your email for the OTP"}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP}>
                            <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "#52B788"}
                                onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                            />

                            <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>
                                Security Answer (Favorite Sport)
                            </label>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Your favorite sport"
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "#52B788"}
                                onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    background: "#1B4332",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "12px",
                                    padding: "0.8rem",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                {loading ? "Sending OTP..." : "Send OTP 🌿"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset}>
                            <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                required
                                style={{ ...inputStyle, fontSize: "24px", textAlign: "center", letterSpacing: "10px" }}
                            />

                            <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "#52B788"}
                                onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    background: "#1B4332",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "12px",
                                    padding: "0.8rem",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                {loading ? "Resetting..." : "Reset Password 🌿"}
                            </button>

                            <p
                                onClick={() => setStep(1)}
                                style={{ textAlign: "center", fontSize: "13px", color: "#2D6A4F", cursor: "pointer", fontWeight: "500" }}
                            >
                                ← Back
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ForgetPassword;