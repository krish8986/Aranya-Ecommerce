import React from "react";
import Layout from "../../components/Layouts/Layout";
import UserMenu from "../../components/Layouts/UserMenu";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  return (
    <Layout title={"Dashboard | Aranya"}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            {/* Welcome Card */}
            <div style={{
              background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
              borderRadius: "20px",
              padding: "2rem",
              color: "#fff",
              marginBottom: "1.5rem",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "0.5rem" }}>🌿</div>
              <h3 style={{ fontWeight: "700", marginBottom: "0.25rem" }}>
                Welcome back, {auth?.user?.name}!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 0, fontSize: "14px" }}>
                Manage your orders and profile from your dashboard
              </p>
            </div>

            {/* Info Cards */}
            <div className="row g-3">
              {[
                { label: "Full Name", value: auth?.user?.name, icon: "👤" },
                { label: "Email Address", value: auth?.user?.email, icon: "📧" },
                { label: "Delivery Address", value: auth?.user?.address || "Not set", icon: "📍" },
              ].map((item, i) => (
                <div className="col-md-6" key={i}>
                  <div style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "1.25rem",
                    border: "1px solid #E9F5EE",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.icon}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "15px", color: "#1A1A1A", fontWeight: "500", marginTop: "4px" }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Actions */}
              <div className="col-md-12">
                <div style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  border: "1px solid #E9F5EE",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ fontSize: "13px", color: "#9CA3AF", fontWeight: "500", marginBottom: "0.75rem", textTransform: "uppercase" }}>
                    Quick Actions
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => navigate("/dashboard/user/orders")}
                      style={{
                        background: "#1B4332",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "0.6rem 1.25rem",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      📦 My Orders
                    </button>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      style={{
                        background: "transparent",
                        color: "#1B4332",
                        border: "1.5px solid #52B788",
                        borderRadius: "10px",
                        padding: "0.6rem 1.25rem",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit Profile
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      style={{
                        background: "transparent",
                        color: "#1B4332",
                        border: "1.5px solid #52B788",
                        borderRadius: "10px",
                        padding: "0.6rem 1.25rem",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      🛍️ Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;