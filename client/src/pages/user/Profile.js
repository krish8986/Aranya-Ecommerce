import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layouts/UserMenu";
import Layout from "./../../components/Layouts/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name, email, password, phone, address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully 🌿");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile | Aranya"}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1px solid #E9F5EE",
              maxWidth: "550px",
            }}>
              {/* Header */}
              <div style={{ marginBottom: "1.75rem" }}>
                <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>
                  ✏️ Edit Profile
                </h4>
                <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>
                  Update your personal information
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {[
                  { label: "Full Name", value: name, setter: setName, type: "text", placeholder: "Enter your name" },
                  { label: "Email Address", value: email, setter: setEmail, type: "email", placeholder: "Email", disabled: true },
                  { label: "New Password", value: password, setter: setPassword, type: "password", placeholder: "Leave blank to keep current" },
                  { label: "Phone Number", value: phone, setter: setPhone, type: "text", placeholder: "Enter your phone" },
                  { label: "Delivery Address", value: address, setter: setAddress, type: "text", placeholder: "Enter your address" },
                ].map((field, i) => (
                  <div key={i} style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "5px", display: "block" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.9rem",
                        border: "1.5px solid #E9F5EE",
                        borderRadius: "10px",
                        fontSize: "14px",
                        outline: "none",
                        background: field.disabled ? "#F8FAF9" : "#fff",
                        color: field.disabled ? "#9CA3AF" : "#1A1A1A",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#52B788"}
                      onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "#1B4332",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "0.5rem",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => e.target.style.background = "#2D6A4F"}
                  onMouseOut={(e) => e.target.style.background = "#1B4332"}
                >
                  Update Profile 🌿
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;