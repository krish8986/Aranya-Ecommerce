import React from "react";
import Layout from "./../components/Layouts/Layout";
import { GiTreeBranch } from "react-icons/gi";

const About = () => {
  const values = [
    { icon: "🌿", title: "Eco-Friendly", desc: "100% biodegradable materials" },
    { icon: "♻️", title: "Sustainable", desc: "Responsible sourcing & manufacturing" },
    { icon: "🌱", title: "Nature-First", desc: "Inspired by forests & wilderness" },
    { icon: "📦", title: "Quality", desc: "Premium paper & bagasse products" },
  ];

  return (
    <Layout
      title={"About Aranya | Sustainable & Eco-Friendly Brand"}
      description={"Learn about Aranya - our mission to provide eco-friendly biodegradable alternatives."}
      keywords={"about aranya, eco-friendly brand, sustainable products"}
      author={"Krishna Kumar"}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <GiTreeBranch style={{ fontSize: "50px", color: "#2D6A4F", marginBottom: "1rem" }} />
          <h2 style={{ color: "#1B4332", fontWeight: "700" }}>About Aranya</h2>
          <p style={{ color: "#6B7280", maxWidth: "500px", margin: "0 auto" }}>
            Connecting people with nature through sustainable products
          </p>
          <div style={{ width: "60px", height: "3px", background: "#52B788", margin: "1rem auto 0", borderRadius: "2px" }} />
        </div>

        {/* Main content */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-md-6">
            <img
              src="/images/aboutus.jpg"
              alt="About Aranya"
              style={{ width: "100%", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
              loading="lazy"
            />
          </div>
          <div className="col-md-6">
            <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "1rem" }}>
              Our Story 🌿
            </h4>
            <p style={{ color: "#374151", lineHeight: "1.8", marginBottom: "1rem", fontSize: "15px" }}>
              <strong>Aranya (अरण्य)</strong> is a Sanskrit word meaning "forest" or "wilderness," symbolizing nature, greenery, and purity. Our brand aligns with eco-friendly, sustainable, and nature-connected values.
            </p>
            <p style={{ color: "#374151", lineHeight: "1.8", marginBottom: "1.5rem", fontSize: "15px" }}>
              We focus on paper-based and eco-friendly products with emphasis on sustainable manufacturing and responsible sourcing from <strong>Gaya ji, Bihar</strong>.
            </p>

            {/* Details */}
            {[
              { label: "Industry", value: "Paper & Stationery | Eco-friendly Products" },
              { label: "Core Products", value: "Notebooks, Paper Products, Corrugated Boxes" },
              { label: "Location", value: "Gaya ji, Bihar — 823001" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "12px",
                marginBottom: "0.75rem",
                padding: "0.75rem 1rem",
                background: "#F8FAF9",
                borderRadius: "10px",
                border: "1px solid #E9F5EE",
              }}>
                <span style={{ color: "#52B788", fontWeight: "600", fontSize: "13px", minWidth: "100px" }}>
                  {item.label}
                </span>
                <span style={{ color: "#374151", fontSize: "13px" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="row g-3">
          {values.map((v, i) => (
            <div className="col-md-3 col-6" key={i}>
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.5rem",
                textAlign: "center",
                border: "1px solid #E9F5EE",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                transition: "all 0.3s",
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
                <div style={{ fontSize: "36px", marginBottom: "0.75rem" }}>{v.icon}</div>
                <h6 style={{ color: "#1B4332", fontWeight: "600", marginBottom: "4px" }}>{v.title}</h6>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default About;