import React from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "./../../components/Layouts/Layout";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { label: "➕ Create Product", path: "/dashboard/admin/create-product" },
    { label: "🏷️ Create Category", path: "/dashboard/admin/create-category" },
    { label: "🛒 View Orders", path: "/dashboard/admin/orders" },
    { label: "📊 Analytics", path: "/dashboard/admin/analytics" },
  ];

  return (
    <Layout
      title={"Admin Dashboard | Aranya"}
      description={"Manage products, categories, orders from the Aranya Admin Dashboard."}
      keywords={"admin dashboard, aranya admin"}
      author={"Krishna Kumar"}
    >
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            {/* Welcome */}
            <div style={{
              background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
              borderRadius: "20px",
              padding: "2rem",
              color: "#fff",
              marginBottom: "1.5rem",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "0.5rem" }}>🌿</div>
              <h3 style={{ fontWeight: "700", marginBottom: "4px" }}>
                Welcome, {auth?.user?.name}!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "14px" }}>
                Manage your Aranya store from here
              </p>
            </div>

            {/* Admin Info */}
            <div className="row g-3 mb-4">
              {[
                { icon: "👤", label: "Admin Name", value: auth?.user?.name },
                { icon: "📧", label: "Email", value: auth?.user?.email },
                { icon: "📞", label: "Contact", value: auth?.user?.phone || "Not set" },
              ].map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "1.25rem",
                    border: "1px solid #E9F5EE",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.icon}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "500", textTransform: "uppercase" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: "500", marginTop: "4px", wordBreak: "break-all" }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1px solid #E9F5EE",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}>
              <h6 style={{ color: "#1B4332", fontWeight: "600", marginBottom: "1rem" }}>
                Quick Actions
              </h6>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    style={{
                      background: i === 0 ? "#1B4332" : "transparent",
                      color: i === 0 ? "#fff" : "#1B4332",
                      border: i === 0 ? "none" : "1.5px solid #52B788",
                      borderRadius: "10px",
                      padding: "0.6rem 1.25rem",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = "0.85";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;