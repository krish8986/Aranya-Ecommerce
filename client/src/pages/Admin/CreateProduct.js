import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layouts/Layout";
import AdminMenu from "./../../components/Layouts/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      toast.error("Error getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      const { data } = await axios.post("/api/v1/product/create-product", productData);
      if (data?.success) {
        toast.success("Product Created Successfully 🌿");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 1rem",
    border: "1.5px solid #E9F5EE",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "500",
    color: "#374151",
    display: "block",
    marginBottom: "5px",
  };

  return (
    <Layout title={"Create Product | Aranya Admin"}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1px solid #E9F5EE",
            }}>
              {/* Header */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "4px" }}>
                  ➕ Create Product
                </h4>
                <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>
                  Add a new product to your store
                </p>
                <div style={{ width: "50px", height: "3px", background: "#52B788", borderRadius: "2px", marginTop: "8px" }} />
              </div>

              <form onSubmit={handleCreate}>
                {/* Category */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Category</label>
                  <Select
                    bordered={false}
                    placeholder="Select a category"
                    size="large"
                    showSearch
                    style={{
                      width: "100%",
                      border: "1.5px solid #E9F5EE",
                      borderRadius: "10px",
                    }}
                    onChange={(value) => setCategory(value)}
                  >
                    {categories?.map((c) => (
                      <Option key={c._id} value={c._id}>{c.name}</Option>
                    ))}
                  </Select>
                </div>

                {/* Photo upload */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Product Photo</label>
                  <label style={{
                    display: "block",
                    border: "2px dashed #52B788",
                    borderRadius: "10px",
                    padding: "1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    color: "#2D6A4F",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "#F0FDF4",
                    transition: "all 0.2s",
                  }}>
                    {photo ? `✅ ${photo.name}` : "📷 Click to upload photo"}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>

                {/* Photo preview */}
                {photo && (
                  <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="preview"
                      style={{ height: "180px", borderRadius: "12px", objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Name */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Product Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter product name"
                    style={inputStyle}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = "#52B788"}
                    onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={description}
                    placeholder="Enter product description"
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = "#52B788"}
                    onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                  />
                </div>

                {/* Price & Quantity */}
                <div className="row g-3" style={{ marginBottom: "1rem" }}>
                  <div className="col-md-6">
                    <label style={labelStyle}>Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      placeholder="Enter price"
                      style={inputStyle}
                      onChange={(e) => setPrice(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = "#52B788"}
                      onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      placeholder="Enter quantity"
                      style={inputStyle}
                      onChange={(e) => setQuantity(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = "#52B788"}
                      onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Shipping Available</label>
                  <Select
                    bordered={false}
                    placeholder="Select shipping option"
                    size="large"
                    style={{
                      width: "100%",
                      border: "1.5px solid #E9F5EE",
                      borderRadius: "10px",
                    }}
                    onChange={(value) => setShipping(value)}
                  >
                    <Option value="0">❌ No</Option>
                    <Option value="1">✅ Yes</Option>
                  </Select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "#1B4332",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.85rem",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => e.target.style.background = "#2D6A4F"}
                  onMouseOut={(e) => e.target.style.background = "#1B4332"}
                >
                  🌿 Create Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;