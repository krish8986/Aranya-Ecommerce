import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [auth] = useAuth();

    const getAnalytics = async () => {
        try {
            const { data } = await axios.get("/api/v1/orders/analytics", {
                headers: { Authorization: auth?.token },
            });
            if (data.success) setAnalytics(data.analytics);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getAnalytics();
    }, [auth?.token]);

    const statusColors = {
        "Not Process": "#F59E0B",
        "Processing": "#3B82F6",
        "Shipped": "#8B5CF6",
        "deliverd": "#10B981",
        "cancel": "#EF4444",
    };

    return (
        <Layout title={"Analytics | Aranya Admin"}>
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>
                                📊 Dashboard Analytics
                            </h4>
                            <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>
                                Real-time store performance overview
                            </p>
                            <div style={{ width: "50px", height: "3px", background: "#52B788", borderRadius: "2px", marginTop: "8px" }} />
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>
                                Loading analytics...
                            </div>
                        ) : (
                            <>
                                {/* Top Stats */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div style={{
                                            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
                                            borderRadius: "16px",
                                            padding: "1.5rem",
                                            color: "#fff",
                                        }}>
                                            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                                                TOTAL ORDERS
                                            </div>
                                            <div style={{ fontSize: "36px", fontWeight: "700" }}>
                                                {analytics?.totalOrders}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
                                                All time orders
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div style={{
                                            background: "linear-gradient(135deg, #378ADD 0%, #1D6BB8 100%)",
                                            borderRadius: "16px",
                                            padding: "1.5rem",
                                            color: "#fff",
                                        }}>
                                            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                                                TOTAL REVENUE
                                            </div>
                                            <div style={{ fontSize: "32px", fontWeight: "700" }}>
                                                ₹{analytics?.totalRevenue?.toLocaleString("en-IN")}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
                                                Gross revenue
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Orders by Status */}
                                <div style={{
                                    background: "#fff",
                                    borderRadius: "16px",
                                    padding: "1.5rem",
                                    border: "1px solid #E9F5EE",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                    marginBottom: "1.5rem",
                                }}>
                                    <h6 style={{ color: "#1B4332", fontWeight: "600", marginBottom: "1.25rem" }}>
                                        📦 Orders by Status
                                    </h6>
                                    <div className="row g-3">
                                        {analytics?.ordersByStatus?.map((s, i) => (
                                            <div className="col-md-4" key={i}>
                                                <div style={{
                                                    background: "#F8FAF9",
                                                    borderRadius: "12px",
                                                    padding: "1rem",
                                                    textAlign: "center",
                                                    border: `2px solid ${statusColors[s._id] || "#E9F5EE"}20`,
                                                }}>
                                                    <div style={{
                                                        fontSize: "28px",
                                                        fontWeight: "700",
                                                        color: statusColors[s._id] || "#1B4332",
                                                    }}>
                                                        {s.count}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", fontWeight: "500" }}>
                                                        {s._id}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Products */}
                                <div style={{
                                    background: "#fff",
                                    borderRadius: "16px",
                                    padding: "1.5rem",
                                    border: "1px solid #E9F5EE",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                }}>
                                    <h6 style={{ color: "#1B4332", fontWeight: "600", marginBottom: "1.25rem" }}>
                                        🏆 Top Selling Products
                                    </h6>
                                    <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #E9F5EE" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ background: "#F8FAF9" }}>
                                                    {["#", "Product", "Price", "Sold"].map((h) => (
                                                        <th key={h} style={{
                                                            padding: "0.75rem 1rem",
                                                            fontSize: "11px",
                                                            color: "#6B7280",
                                                            fontWeight: "600",
                                                            textTransform: "uppercase",
                                                            textAlign: h === "#" ? "center" : "left",
                                                        }}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics?.topProducts?.map((p, i) => (
                                                    <tr key={i} style={{ borderTop: "1px solid #E9F5EE" }}>
                                                        <td style={{ padding: "0.85rem 1rem", textAlign: "center", color: "#6B7280", fontSize: "13px" }}>
                                                            {i + 1}
                                                        </td>
                                                        <td style={{ padding: "0.85rem 1rem", fontWeight: "500", fontSize: "14px", color: "#1A1A1A" }}>
                                                            {p.name}
                                                        </td>
                                                        <td style={{ padding: "0.85rem 1rem", color: "#2D6A4F", fontWeight: "600", fontSize: "13px" }}>
                                                            ₹{p.price?.toLocaleString()}
                                                        </td>
                                                        <td style={{ padding: "0.85rem 1rem" }}>
                                                            <span style={{
                                                                background: "#D8F3DC",
                                                                color: "#1B4332",
                                                                padding: "3px 10px",
                                                                borderRadius: "20px",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                            }}>
                                                                {p.totalSold} sold
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;