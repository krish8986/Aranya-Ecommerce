import React, { useState } from "react";
import Layout from "./../../components/Layouts/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GiTreeBranch } from "react-icons/gi";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("Session expired, please register again");
            navigate("/register");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post("/api/v1/auth/verify-otp", { userId, otp });
            if (res.data.success) {
                toast.success("Email verified! You can login now 🌿");
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const res = await axios.post("/api/v1/auth/resend-otp", { userId });
            if (res.data.success) toast.success("OTP resent to your email");
        } catch (error) {
            toast.error("Could not resend OTP");
        }
    };

    return (
        <Layout title={"Verify Email | Aranya"}>
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
                    textAlign: "center",
                }}>
                    <GiTreeBranch style={{ fontSize: "40px", color: "#2D6A4F", marginBottom: "8px" }} />
                    <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>Verify Your Email</h4>
                    <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "1.5rem" }}>
                        Enter the 6-digit OTP sent to your email
                    </p>

                    <form onSubmit={handleVerify}>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            required
                            style={{
                                width: "100%",
                                padding: "0.85rem",
                                border: "1.5px solid #E9F5EE",
                                borderRadius: "10px",
                                fontSize: "24px",
                                textAlign: "center",
                                letterSpacing: "10px",
                                outline: "none",
                                marginBottom: "1.25rem",
                            }}
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
                            {loading ? "Verifying..." : "🌿 Verify Email"}
                        </button>
                    </form>

                    <p style={{ marginTop: "1.25rem", fontSize: "13px", color: "#6B7280" }}>
                        Didn't get the code?{" "}
                        <span onClick={handleResend} style={{ color: "#2D6A4F", fontWeight: "600", cursor: "pointer" }}>
                            Resend OTP
                        </span>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default VerifyOTP;