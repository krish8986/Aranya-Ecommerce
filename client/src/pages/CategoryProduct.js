import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout
      title={`${category?.name} | Aranya`}
      description={"Explore category products at Aranya."}
      keywords={"category products, eco-friendly, aranya"}
      author={"Krishna Kumar"}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 style={{ color: "#1B4332", fontWeight: "700" }}>
            🌿 {category?.name}
          </h2>
          <p style={{ color: "#6B7280" }}>{products?.length} products found</p>
          <div style={{ width: "60px", height: "3px", background: "#52B788", margin: "0 auto", borderRadius: "2px" }} />
        </div>

        {/* Products */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {products?.map((p) => (
            <div
              key={p._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
                width: "220px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: "1px solid #E9F5EE",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(45,106,79,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.07)";
              }}
            >
              <img
                src={p?.photo?.url || `/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
                loading="lazy"
              />
              <div style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h6 style={{ fontWeight: "600", color: "#1A1A1A", margin: 0, fontSize: "14px" }}>{p.name}</h6>
                  <span style={{ color: "#2D6A4F", fontWeight: "700", fontSize: "13px" }}>
                    ₹{p.price.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "0.75rem" }}>
                  {p.description.substring(0, 50)}...
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => navigate(`/product/${p.slug}`)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1.5px solid #52B788",
                      color: "#2D6A4F",
                      borderRadius: "8px",
                      padding: "0.3rem",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success("Added to cart!");
                    }}
                    style={{
                      flex: 1,
                      background: "#1B4332",
                      border: "none",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "0.3rem",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;