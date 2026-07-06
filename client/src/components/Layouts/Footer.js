import React from "react";
import { Link } from "react-router-dom";
import { GiTreeBranch } from "react-icons/gi";

const Footer = () => {
    return (
        <footer style={{
            background: "#1B4332",
            color: "#fff",
            padding: "3rem 0 1.5rem",
            marginTop: "3rem",
        }}>
            <div className="container">
                <div className="row">

                    {/* Brand */}
                    <div className="col-md-4 mb-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <GiTreeBranch style={{ fontSize: "28px", color: "#95D5B2" }} />
                            <div>
                                <div style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "2px" }}>
                                    ARANYA
                                </div>
                                <div style={{ fontSize: "10px", color: "#95D5B2", fontStyle: "italic", letterSpacing: "1px" }}>
                                    Weave Your Tale
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                            We are committed to providing 100% biodegradable and sustainable products for a greener future.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-2 mb-4">
                        <h6 style={{ color: "#95D5B2", fontWeight: "600", marginBottom: "1rem", letterSpacing: "1px", fontSize: "13px" }}>
                            QUICK LINKS
                        </h6>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {[
                                { to: "/", label: "Home" },
                                { to: "/about", label: "About Us" },
                                { to: "/categories", label: "Categories" },
                                { to: "/cart", label: "Cart" },
                            ].map((link) => (
                                <li key={link.to} style={{ marginBottom: "0.5rem" }}>
                                    <Link
                                        to={link.to}
                                        style={{
                                            color: "rgba(255,255,255,0.7)",
                                            textDecoration: "none",
                                            fontSize: "13px",
                                            transition: "color 0.2s",
                                        }}
                                        onMouseOver={(e) => (e.target.style.color = "#95D5B2")}
                                        onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
                                    >
                                        → {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="col-md-2 mb-4">
                        <h6 style={{ color: "#95D5B2", fontWeight: "600", marginBottom: "1rem", letterSpacing: "1px", fontSize: "13px" }}>
                            LEGAL
                        </h6>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {[
                                { to: "/policy", label: "Privacy Policy" },
                                { to: "/contact", label: "Contact Us" },
                            ].map((link) => (
                                <li key={link.to} style={{ marginBottom: "0.5rem" }}>
                                    <Link
                                        to={link.to}
                                        style={{
                                            color: "rgba(255,255,255,0.7)",
                                            textDecoration: "none",
                                            fontSize: "13px",
                                        }}
                                        onMouseOver={(e) => (e.target.style.color = "#95D5B2")}
                                        onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
                                    >
                                        → {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-md-4 mb-4">
                        <h6 style={{ color: "#95D5B2", fontWeight: "600", marginBottom: "1rem", letterSpacing: "1px", fontSize: "13px" }}>
                            CONTACT US
                        </h6>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>
                            📧 aranya25626@gmail.com
                        </p>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>
                            📍 Gaya ji, Bihar, 823001, India
                        </p>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                            🌿 100% Eco-Friendly Products
                        </p>
                    </div>

                </div>

                {/* Divider */}
                <hr style={{ borderColor: "rgba(255,255,255,0.15)", margin: "1.5rem 0 1rem" }} />

                {/* Bottom bar */}
                <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: "1rem" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                        © 2026 Aranya. All Rights Reserved. Made with 🌿 by Krishna Kumar Gupta
                    </p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                        🌱 Building a sustainable future
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;