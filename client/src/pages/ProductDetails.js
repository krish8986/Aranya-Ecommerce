import React, { useState, useEffect } from "react";
import Layout from "./../components/Layouts/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
      getReviews(data?.product._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async (pid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/reviews/${pid}`);
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) { toast.error("Please login to add a review"); return; }
    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `/api/v1/product/review/${product._id}`,
        { rating, comment },
        { headers: { Authorization: auth?.token } }
      );
      if (data.success) {
        toast.success("Review added! 🌿");
        setComment("");
        setRating(5);
        getReviews(product._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (r) => "⭐".repeat(Math.round(r));

  const addToCart = () => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Added to cart! 🌿");
  };

  return (
    <Layout title={`${product?.name} | Aranya`}>
      <div className="container py-5">

        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "1.5rem" }}>
          <span style={{ cursor: "pointer", color: "#2D6A4F" }} onClick={() => navigate("/")}>Home</span>
          {" → "}
          <span style={{ cursor: "pointer", color: "#2D6A4F" }} onClick={() => navigate("/")}>Products</span>
          {" → "}
          <span style={{ color: "#1A1A1A", fontWeight: "500" }}>{product?.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="row g-5 mb-5">
          {/* Image */}
          <div className="col-md-5">
            <div style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              background: "#F8FAF9",
              padding: "1rem",
            }}>
              <img
                src={product?.photo?.url || `/api/v1/product/product-photo/${product._id}`}
                alt={product?.name}
                style={{ width: "100%", height: "380px", objectFit: "contain", borderRadius: "12px" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Info */}
          <div className="col-md-7">
            {/* Badge */}
            <div style={{
              display: "inline-block",
              background: "#D8F3DC",
              color: "#1B4332",
              fontSize: "11px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "20px",
              marginBottom: "0.75rem",
              letterSpacing: "0.5px",
            }}>
              🌿 {product?.category?.name}
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1A1A1A", marginBottom: "0.5rem" }}>
              {product?.name}
            </h1>

            {/* Rating row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ fontSize: "16px", color: star <= Math.round(averageRating) ? "#F59E0B" : "#D1D5DB" }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#6B7280" }}>
                {averageRating.toFixed(1)} ({totalReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "34px", fontWeight: "800", color: "#1B4332" }}>
                ₹{product?.price?.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "13px", color: "#6B7280", marginLeft: "8px" }}>inclusive of all taxes</span>
            </div>

            {/* Description */}
            <p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.8", marginBottom: "1.5rem", borderTop: "1px solid #E9F5EE", paddingTop: "1rem" }}>
              {product?.description}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
              {["Eco-Friendly", "Biodegradable", "Sustainable", "Zero Waste"].map((tag) => (
                <span key={tag} style={{
                  background: "#F0FDF4",
                  color: "#166534",
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid #BBF7D0",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={addToCart}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  background: "#1B4332",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.9rem 1.5rem",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#2D6A4F"}
                onMouseOut={(e) => e.currentTarget.style.background = "#1B4332"}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={() => navigate("/cart")}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  background: "transparent",
                  color: "#1B4332",
                  border: "2px solid #1B4332",
                  borderRadius: "12px",
                  padding: "0.9rem 1.5rem",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#1B4332"; e.currentTarget.style.color = "#fff"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1B4332"; }}
              >
                Buy Now →
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "20px", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {[
                { icon: "🚚", text: "Free Delivery" },
                { icon: "♻️", text: "100% Eco-Friendly" },
                { icon: "✅", text: "Quality Assured" },
              ].map((b) => (
                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6B7280" }}>
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: "2px solid #E9F5EE", marginBottom: "2rem", display: "flex", gap: "2rem" }}>
          {["details", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                padding: "0.75rem 0",
                fontSize: "14px",
                fontWeight: "600",
                color: activeTab === tab ? "#1B4332" : "#6B7280",
                borderBottom: activeTab === tab ? "2px solid #1B4332" : "2px solid transparent",
                marginBottom: "-2px",
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
            >
              {tab === "details" ? "📋 Product Details" : `⭐ Reviews (${totalReviews})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid #E9F5EE",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "3rem",
          }}>
            <div className="row g-3">
              {[
                { label: "Product Name", value: product?.name },
                { label: "Category", value: product?.category?.name },
                { label: "Price", value: `₹${product?.price?.toLocaleString("en-IN")}` },
                { label: "Average Rating", value: `${averageRating.toFixed(1)}/5 (${totalReviews} reviews)` },
                { label: "Material", value: "100% Biodegradable" },
                { label: "Origin", value: "Made in India 🇮🇳" },
              ].map((item, i) => (
                <div className="col-md-6" key={i}>
                  <div style={{ padding: "0.75rem 1rem", background: i % 2 === 0 ? "#F8FAF9" : "#fff", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: "500" }}>{item.label}</span>
                    <span style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: "600" }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ marginBottom: "3rem" }}>
            <div className="row g-4">
              {/* Write Review */}
              <div className="col-md-5">
                <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #E9F5EE", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h5 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "1.25rem" }}>
                    ✏️ Write a Review
                  </h5>
                  {auth?.token ? (
                    <form onSubmit={handleReviewSubmit}>
                      <div style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "8px" }}>
                          Your Rating
                        </label>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setRating(star)}
                              style={{ fontSize: "28px", cursor: "pointer", color: star <= rating ? "#F59E0B" : "#D1D5DB", transition: "color 0.1s" }}
                            >★</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "5px" }}>Comment</label>
                        <textarea
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          required
                          style={{ width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #E9F5EE", borderRadius: "10px", fontSize: "14px", outline: "none", resize: "vertical" }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{ width: "100%", background: "#1B4332", color: "#fff", border: "none", borderRadius: "10px", padding: "0.75rem", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                      >
                        {submitting ? "Submitting..." : "Submit Review 🌿"}
                      </button>
                    </form>
                  ) : (
                    <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                      <p style={{ color: "#6B7280", marginBottom: "1rem", fontSize: "14px" }}>Login to write a review</p>
                      <button onClick={() => navigate("/login")} style={{ background: "#1B4332", color: "#fff", border: "none", borderRadius: "10px", padding: "0.6rem 1.5rem", cursor: "pointer", fontSize: "14px" }}>
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="col-md-7">
                {reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>
                    <div style={{ fontSize: "40px", marginBottom: "0.5rem" }}>💬</div>
                    <p>No reviews yet — be the first!</p>
                  </div>
                ) : (
                  reviews.map((r, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "1.25rem", marginBottom: "0.75rem", border: "1px solid #E9F5EE", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#D8F3DC", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#1B4332", fontSize: "14px" }}>
                            {r.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: "600", fontSize: "14px", color: "#1A1A1A" }}>{r.name}</span>
                        </div>
                        <div style={{ display: "flex" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ fontSize: "14px", color: star <= r.rating ? "#F59E0B" : "#D1D5DB" }}>★</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: "1.6" }}>{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h4 style={{ color: "#1B4332", fontWeight: "700", marginBottom: "1.5rem" }}>Similar Products</h4>
            <div className="row g-3">
              {relatedProducts.map((p) => (
                <div className="col-6 col-md-3" key={p._id}>
                  <div
                    style={{ background: "#fff", borderRadius: "14px", overflow: "hidden", border: "1px solid #E9F5EE", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.3s" }}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(45,106,79,0.15)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)"; }}
                  >
                    <img
                      src={p?.photo?.url || `/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                      loading="lazy"
                    />
                    <div style={{ padding: "0.85rem" }}>
                      <h6 style={{ fontWeight: "600", fontSize: "13px", color: "#1A1A1A", marginBottom: "4px" }}>{p.name}</h6>
                      <span style={{ color: "#2D6A4F", fontWeight: "700", fontSize: "14px" }}>₹{p.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;