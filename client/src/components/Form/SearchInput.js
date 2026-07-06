import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="d-flex align-items-center"
      role="search"
      onSubmit={handleSubmit}
      style={{ gap: "0" }}
    >
      <input
        type="search"
        placeholder="Search products..."
        value={values.keyword}
        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        style={{
          border: "none",
          borderRadius: "25px 0 0 25px",
          padding: "0.4rem 1.2rem",
          fontSize: "13px",
          width: "200px",
          outline: "none",
          background: "rgba(255,255,255,0.95)",
          color: "#1A1A1A",
        }}
      />
      <button
        type="submit"
        style={{
          borderRadius: "0 25px 25px 0",
          background: "#52B788",
          border: "none",
          color: "white",
          padding: "0.4rem 1rem",
          fontSize: "13px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.background = "#40916C")}
        onMouseOut={(e) => (e.target.style.background = "#52B788")}
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;