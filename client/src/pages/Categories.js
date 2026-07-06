import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layouts/Layout";

const Categories = () => {
  const categories = useCategory();

  const categoryEmojis = {
    utensils: "🍴",
    copy: "📋",
    plate: "🍽️",
    bowls: "🥣",
    spoon: "🥄",
    glass: "🥛",
    box: "📦",
    "packing box": "📦",
  };

  return (
    <Layout title={"All Categories | Aranya"}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 style={{ color: "#1B4332", fontWeight: "700", fontSize: "32px" }}>
            Shop by Category
          </h2>
          <p style={{ color: "#6B7280", fontSize: "15px" }}>
            Explore our range of 100% biodegradable products
          </p>
          <div style={{ width: "60px", height: "3px", background: "#52B788", margin: "0 auto", borderRadius: "2px" }} />
        </div>

        {/* Category Grid */}
        <div className="row g-4">
          {categories.map((c) => (
            <div className="col-6 col-md-4 col-lg-3" key={c._id}>
              <Link
                to={`/category/${c.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid #E9F5EE",
                    borderRadius: "16px",
                    padding: "2rem 1rem",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(45,106,79,0.15)";
                    e.currentTarget.style.borderColor = "#52B788";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = "#E9F5EE";
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "0.75rem" }}>
                    {categoryEmojis[c.name.toLowerCase()] || "🌿"}
                  </div>
                  <h6 style={{
                    color: "#1B4332",
                    fontWeight: "600",
                    fontSize: "14px",
                    margin: 0,
                    textTransform: "capitalize",
                  }}>
                    {c.name}
                  </h6>
                  <p style={{
                    color: "#52B788",
                    fontSize: "12px",
                    margin: "4px 0 0",
                    fontWeight: "500",
                  }}>
                    View Products →
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;