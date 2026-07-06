import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layouts/Layout";
import { GiTreeBranch } from "react-icons/gi";

const Pagenotfound = () => {
    return (
        <Layout title={"404 - Page Not Found | Aranya"}>
            <div style={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
            }}>
                <GiTreeBranch style={{ fontSize: "60px", color: "#52B788", marginBottom: "1rem" }} />
                <h1 style={{ fontSize: "80px", fontWeight: "800", color: "#1B4332", lineHeight: 1 }}>
                    404
                </h1>
                <h3 style={{ color: "#374151", fontWeight: "600", marginBottom: "0.5rem" }}>
                    Oops! Page Not Found
                </h3>
                <p style={{ color: "#6B7280", marginBottom: "2rem", maxWidth: "400px" }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    style={{
                        background: "#1B4332",
                        color: "#fff",
                        padding: "0.75rem 2rem",
                        borderRadius: "25px",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "15px",
                        transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => e.target.style.background = "#2D6A4F"}
                    onMouseOut={(e) => e.target.style.background = "#1B4332"}
                >
                    🌿 Go Back Home
                </Link>
            </div>
        </Layout>
    );
};

export default Pagenotfound;