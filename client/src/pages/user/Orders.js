import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layouts/UserMenu";
import Layout from "./../../components/Layouts/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

// const socket = io("http://localhost:8000");
const socket = io(process.env.REACT_APP_API);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/orders/Orders", {
        headers: { Authorization: auth?.token },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  useEffect(() => {
    socket.on("order_status_update", (data) => {
      toast.success(`📦 ${data.message}`);
      getOrders();
    });
    return () => socket.off("order_status_update");
  }, []);

  const statusColor = {
    "Not Process": "#F59E0B",
    "Processing": "#3B82F6",
    "Shipped": "#8B5CF6",
    "deliverd": "#10B981",
    "cancel": "#EF4444",
  };

  return (
    <Layout title={"My Orders | Aranya"}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "1.5rem" }}>
              📦 My Orders
            </h4>

            {orders.length === 0 ? (
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "3rem",
                textAlign: "center",
                border: "1px solid #E9F5EE",
              }}>
                <div style={{ fontSize: "50px", marginBottom: "1rem" }}>📭</div>
                <h5 style={{ color: "#6B7280" }}>No orders yet</h5>
                <p style={{ color: "#9CA3AF", fontSize: "13px" }}>Your orders will appear here</p>
              </div>
            ) : (
              orders.map((o, i) => (
                <div
                  key={o._id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    marginBottom: "1rem",
                    border: "1px solid #E9F5EE",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Order Header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #E9F5EE",
                  }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Order #{i + 1}</span>
                      <div style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                        {moment(o?.createdAt).fromNow()}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{
                        background: o?.payment?.status === "Success" ? "#ECFDF5" : "#FEF2F2",
                        color: o?.payment?.status === "Success" ? "#10B981" : "#EF4444",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}>
                        {o?.payment?.status === "Success" ? "✅ Paid" : "❌ Failed"}
                      </span>
                      <span style={{
                        background: "#F0FDF4",
                        color: statusColor[o?.status] || "#6B7280",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        border: `1px solid ${statusColor[o?.status] || "#E5E7EB"}`,
                      }}>
                        {o?.status}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  {o?.products?.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        padding: "0.75rem 0",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <img
                        src={p?.photo?.url || `/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "10px" }}
                        loading="lazy"
                      />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1A1A1A" }}>{p.name}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                          {p.description?.substring(0, 40)}...
                        </div>
                        <div style={{ color: "#2D6A4F", fontWeight: "700", fontSize: "14px", marginTop: "4px" }}>
                          ₹{p.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;