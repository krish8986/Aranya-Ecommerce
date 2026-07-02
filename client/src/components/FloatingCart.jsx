import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import { useCart } from "../context/cart";

const FloatingCart = () => {
  const [cart] = useCart();

  return (
    <Link to="/cart" className="floating-cart">
      <Badge count={cart?.length} size="small" showZero style={{ backgroundColor: "#28a745" }}>
        🛒
      </Badge>
    </Link>
  );
};

export default FloatingCart;
