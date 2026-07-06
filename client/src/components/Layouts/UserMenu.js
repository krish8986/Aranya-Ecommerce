import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";

const UserMenu = () => {
  const [auth] = useAuth();

  const menuItems = [
    { to: "/dashboard/user", label: "🏠 Overview" },
    { to: "/dashboard/user/profile", label: "👤 Profile" },
    { to: "/dashboard/user/orders", label: "📦 My Orders" },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "1.25rem",
      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
      border: "1px solid #E9F5EE",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
        borderRadius: "12px",
        padding: "1rem",
        textAlign: "center",
        marginBottom: "1rem",
      }}>
        <div style={{ fontSize: "28px", marginBottom: "4px" }}>🌿</div>
        <div style={{ color: "#fff", fontWeight: "700", fontSize: "13px", letterSpacing: "1px" }}>
          MY ACCOUNT
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", marginTop: "2px" }}>
          {auth?.user?.name}
        </div>
      </div>

      {/* Menu items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard/user"}
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
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default UserMenu;