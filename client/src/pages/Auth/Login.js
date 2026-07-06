import React, { useState } from "react";
import Layout from "./../../components/Layouts/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { GiTreeBranch } from "react-icons/gi";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
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
    padding: "0.7rem 1rem",
    border: "1.5px solid #E9F5EE",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    marginBottom: "1rem",
    transition: "border-color 0.2s",
  };

  return (
    <Layout title={"Login | Aranya"}>
      <div style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8FAF9",
        padding: "2rem",
      }}>
        <div className="login-card"
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2.5rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            border: "1px solid #E9F5EE",
          }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <GiTreeBranch style={{ fontSize: "40px", color: "#2D6A4F", marginBottom: "8px" }} />
            <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>Welcome Back</h4>
            <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>Login to your Aranya account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter your email"
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#52B788"}
              onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
            />

            <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#52B788"}
              onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
            />

            <div style={{ textAlign: "right", marginBottom: "1.25rem", marginTop: "-0.5rem" }}>
              <span
                onClick={() => navigate("/forget-password")}
                style={{ fontSize: "12px", color: "#2D6A4F", cursor: "pointer", fontWeight: "500" }}
              >
                Forgot Password?
              </span>
            </div>

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
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => e.target.style.background = "#2D6A4F"}
              onMouseOut={(e) => e.target.style.background = "#1B4332"}
            >
              🌿 Login
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "13px", color: "#6B7280" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2D6A4F", fontWeight: "600", textDecoration: "none" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;