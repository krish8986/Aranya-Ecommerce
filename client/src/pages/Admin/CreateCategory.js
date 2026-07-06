import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layouts/Layout";
import AdminMenu from "./../../components/Layouts/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", { name });
      if (data?.success) {
        toast.success(`${name} created successfully 🌿`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} updated!`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${pId}`);
      if (data.success) {
        toast.success("Category deleted");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Manage Categories | Aranya Admin"}>
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
                  🏷️ Manage Categories
                </h4>
                <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>
                  Add, edit or delete product categories
                </p>
                <div style={{ width: "50px", height: "3px", background: "#52B788", borderRadius: "2px", marginTop: "8px" }} />
              </div>

              {/* Add category form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter new category name"
                  required
                  style={{
                    flex: 1,
                    padding: "0.65rem 1rem",
                    border: "1.5px solid #E9F5EE",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#52B788"}
                  onBlur={(e) => e.target.style.borderColor = "#E9F5EE"}
                />
                <button
                  type="submit"
                  style={{
                    background: "#1B4332",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.65rem 1.5rem",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  + Add
                </button>
              </form>

              {/* Categories table */}
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E9F5EE" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8FAF9" }}>
                      <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "12px", color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Category Name
                      </th>
                      <th style={{ padding: "0.85rem 1rem", textAlign: "right", fontSize: "12px", color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((c, i) => (
                      <tr
                        key={c._id}
                        style={{
                          borderTop: "1px solid #E9F5EE",
                          background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                        }}
                      >
                        <td style={{ padding: "0.85rem 1rem", fontSize: "14px", color: "#1A1A1A", fontWeight: "500" }}>
                          🌿 {c.name}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                          <button
                            onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c); }}
                            style={{
                              background: "#D8F3DC",
                              color: "#1B4332",
                              border: "none",
                              borderRadius: "8px",
                              padding: "0.4rem 1rem",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                              marginRight: "8px",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            style={{
                              background: "#FEF2F2",
                              color: "#DC2626",
                              border: "none",
                              borderRadius: "8px",
                              padding: "0.4rem 1rem",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        onCancel={() => setVisible(false)}
        footer={null}
        open={visible}
        title="Edit Category"
      >
        <form onSubmit={handleUpdate} style={{ padding: "1rem 0" }}>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Enter updated name"
            style={{
              width: "100%",
              padding: "0.65rem 1rem",
              border: "1.5px solid #E9F5EE",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
              marginBottom: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#1B4332",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "0.7rem",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Update Category 🌿
          </button>
        </form>
      </Modal>
    </Layout>
  );
};

export default CreateCategory;