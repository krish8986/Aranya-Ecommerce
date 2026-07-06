import React, { useState } from "react";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GiTreeBranch } from "react-icons/gi";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/register", {
                name, email, password, phone, address, answer,
            });
            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/verify-otp", { state: { userId: res.data.userId } });
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach((err) => toast.error(`${err.field}: ${err.message}`));
            } else {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "0.65rem 1rem",
        border: "1.5px solid #E9F5EE",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none",
        marginBottom: "0.85rem",
        transition: "border-color 0.2s",
    };

    const fields = [
        { label: "Full Name", value: name, setter: setName, type: "text", placeholder: "Enter your name" },
        { label: "Email Address", value: email, setter: setemail, type: "email", placeholder: "Enter your email" },
        { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Min 6 characters" },
        { label: "Phone Number", value: phone, setter: setPhone, type: "text", placeholder: "10 digit number" },
        { label: "Address", value: address, setter: setAddress, type: "text", placeholder: "Delivery address" },
        { label: "Security Question", value: answer, setter: setAnswer, type: "text", placeholder: "Your favorite sport?" },
    ];

    return (
        <Layout title={"Register | Aranya"}>
            <div style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F8FAF9",
                padding: "2rem",
            }}>
                <div className="register-card"
                    style={{
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "2.5rem",
                        width: "100%",
                        maxWidth: "440px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                        border: "1px solid #E9F5EE",
                    }}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <GiTreeBranch style={{ fontSize: "40px", color: "#2D6A4F", marginBottom: "8px" }} />
                        <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>Create Account</h4>
                        <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>Join Aranya — Shop sustainably 🌿</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {fields.map((field, i) => (
                            <div key={i}>
                                <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    value={field.value}
                                    onChange={(e) => field.setter(e.target.value)}
                                    placeholder={field.placeholder}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "#52B788"}
                                    onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
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
                                marginTop: "0.5rem",
                                transition: "all 0.2s",
                            }}
                            onMouseOver={(e) => e.target.style.background = "#2D6A4F"}
                            onMouseOut={(e) => e.target.style.background = "#1B4332"}
                        >
                            🌿 Create Account
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "13px", color: "#6B7280" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#2D6A4F", fontWeight: "600", textDecoration: "none" }}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Register;