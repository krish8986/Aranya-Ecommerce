import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "./../../components/Layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"All Products | Aranya Admin"}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "1.5rem" }}>
              📦 All Products
            </h4>

            <div className="row g-3">
              {products?.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <Link
                    to={`/dashboard/admin/product/${p.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      background: "#fff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #E9F5EE",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(45,106,79,0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
                      }}
                    >
                      <img
                        src={p.photo?.url || `/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        style={{ width: "100%", height: "180px", objectFit: "cover" }}
                        loading="lazy"
                      />
                      <div style={{ padding: "1rem" }}>
                        <h6 style={{ fontWeight: "600", color: "#1A1A1A", marginBottom: "4px", fontSize: "14px" }}>
                          {p.name}
                        </h6>
                        <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, lineHeight: "1.5" }}>
                          {p.description?.substring(0, 60)}...
                        </p>
                        <div style={{
                          marginTop: "0.75rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                          <span style={{ color: "#2D6A4F", fontWeight: "700", fontSize: "14px" }}>
                            ₹{p.price?.toLocaleString()}
                          </span>
                          <span style={{
                            background: "#D8F3DC",
                            color: "#1B4332",
                            fontSize: "11px",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontWeight: "500",
                          }}>
                            Edit →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;