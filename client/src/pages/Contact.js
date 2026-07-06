import React from "react";
import Layout from "./../components/Layouts/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import { GiTreeBranch } from "react-icons/gi";

const Contact = () => {
  return (
    <Layout
      title={"Contact Aranya | Get in Touch"}
      description={"Contact Aranya for premium biodegradable products."}
      keywords={"contact aranya, eco-friendly contact"}
      author={"Krishna Kumar"}
    >
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 style={{ color: "#1B4332", fontWeight: "700" }}>Contact Us</h2>
          <p style={{ color: "#6B7280" }}>We are here to help you 24/7</p>
          <div style={{ width: "60px", height: "3px", background: "#52B788", margin: "0 auto", borderRadius: "2px" }} />
        </div>

        <div className="row justify-content-center g-4">
          {/* Image */}
          <div className="col-md-5">
            <img
              src="/images/contactus.jpg"
              alt="contactus"
              style={{ width: "100%", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              loading="lazy"
            />
          </div>

          {/* Contact Info */}
          <div className="col-md-5">
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1px solid #E9F5EE",
              height: "100%",
            }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <GiTreeBranch style={{ fontSize: "28px", color: "#2D6A4F" }} />
                <h4 style={{ color: "#1B4332", fontWeight: "700", margin: 0 }}>ARANYA</h4>
              </div>

              <p style={{ color: "#6B7280", marginBottom: "2rem", lineHeight: "1.7" }}>
                Any query or info about our products? Feel free to reach out anytime — we are available 24×7.
              </p>

              {[
                { icon: <BiMailSend size={20} />, label: "Email", value: "aranya25626@gmail.com" },
                { icon: <BiPhoneCall size={20} />, label: "Phone", value: "1234567" },
                { icon: <BiSupport size={20} />, label: "Toll Free", value: "1800-0000-0000" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0.85rem 1rem",
                    background: "#F8FAF9",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    border: "1px solid #E9F5EE",
                  }}
                >
                  <span style={{ color: "#2D6A4F" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "500" }}>{item.label}</div>
                    <div style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: "500" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;