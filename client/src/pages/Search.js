// import React from "react";
// import Layout from "./../components/Layouts/Layout";
// import { useSearch } from "../context/search";
// const Search = () => {
//   const [values, setValues] = useSearch();
//   return (
//     <Layout title={"Search results"}>
//       <div className="container">
//         <div className="text-center">
//           <h1>Search Results</h1>
//           <h6>
//             {values?.results.length < 1
//               ? "No Products Found"
//               : `Found ${values?.results.length}`}
//           </h6>
//           <div className="d-flex flex-wrap mt-4">
//             {values?.results.map((p) => (
//               <div className="card m-2" style={{ width: "18rem" }}>
//                 <img
//                   src={`/api/v1/product/product-photo/${p._id}`}
//                   className="card-img-top"
//                   alt={p.name}
//                   loading="lazy"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{p.name}</h5>
//                   <p className="card-text">
//                     {p.description.substring(0, 30)}...
//                   </p>
//                   <p className="card-text"> ₹{p.price}</p>
//                   <button class="btn btn-primary ms-1">More Details</button>
//                   <button class="btn btn-secondary ms-1">ADD TO CART</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Search;


import React from "react";
import Layout from "../components/Layouts/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  return (
    <Layout title={"Search Results | Aranya"}>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h4 style={{ color: "#1B4332", fontWeight: "700" }}>Search Results</h4>
          <p style={{ color: "#6B7280" }}>
            {values?.results?.length < 1
              ? "No products found"
              : `Found ${values?.results?.length} product(s)`}
          </p>
          <div style={{ width: "50px", height: "3px", background: "#52B788", margin: "0 auto", borderRadius: "2px" }} />
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          {values?.results?.map((p) => (
            <div key={p._id} style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
              width: "220px",
              overflow: "hidden",
              border: "1px solid #E9F5EE",
              transition: "all 0.3s",
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(45,106,79,0.15)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.07)"; }}
            >
              <img
                src={p?.photo?.url || "https://via.placeholder.com/220x180?text=No+Image"}
                alt={p.name}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
                loading="lazy"
              />
              <div style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h6 style={{ fontWeight: "600", color: "#1A1A1A", margin: 0, fontSize: "14px" }}>{p.name}</h6>
                  <span style={{ color: "#2D6A4F", fontWeight: "700", fontSize: "13px" }}>₹{p.price}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "0.75rem" }}>
                  {p.description?.substring(0, 50)}...
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => navigate(`/product/${p.slug}`)}
                    style={{ flex: 1, background: "transparent", border: "1.5px solid #52B788", color: "#2D6A4F", borderRadius: "8px", padding: "0.3rem", fontSize: "12px", cursor: "pointer" }}
                  >Details</button>
                  <button
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success("Added to cart!");
                    }}
                    style={{ flex: 1, background: "#1B4332", border: "none", color: "#fff", borderRadius: "8px", padding: "0.3rem", fontSize: "12px", cursor: "pointer" }}
                  >Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;