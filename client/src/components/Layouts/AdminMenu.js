import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const menuItems = [
    { to: "/dashboard/admin", label: "🏠 Overview", exact: true },
    { to: "/dashboard/admin/create-category", label: "🏷️ Create Category" },
    { to: "/dashboard/admin/create-product", label: "➕ Create Product" },
    { to: "/dashboard/admin/products", label: "📦 Products" },
    { to: "/dashboard/admin/orders", label: "🛒 Orders" },
    { to: "/dashboard/admin/analytics", label: "📊 Analytics" },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "1.25rem",
      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
      border: "1px solid #E9F5EE",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
        borderRadius: "12px",
        padding: "1rem",
        textAlign: "center",
        marginBottom: "1rem",
      }}>
        <div style={{ fontSize: "24px", marginBottom: "4px" }}>🌿</div>
        <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px", letterSpacing: "1px" }}>
          ADMIN PANEL
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "block",
              padding: "0.6rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: isActive ? "600" : "400",
              color: isActive ? "#1B4332" : "#374151",
              background: isActive ? "#D8F3DC" : "transparent",
              transition: "all 0.2s",
            })}
            onMouseOver={(e) => {
              if (!e.currentTarget.style.background.includes("D8F3DC")) {
                e.currentTarget.style.background = "#F0FDF4";
              }
            }}
            onMouseOut={(e) => {
              if (!e.currentTarget.className.includes("active")) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;