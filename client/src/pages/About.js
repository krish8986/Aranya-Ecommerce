import React from "react";
import Layout from "./../components/Layouts/Layout";

const About = () => {
  return (
    // <Layout title={"About us - Aranya"}>
    <Layout
  title={"About Aranya | Sustainable & Eco-Friendly Brand"}
  description={"Learn about Aranya - our mission to provide eco-friendly biodegradable alternatives like notebooks, tableware, and more."}
  keywords={"about aranya, eco-friendly brand, sustainable products, biodegradable products, krishna kumar"}
  author={"Krishna Kumar"}
>

      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/aboutus.jpg"
            alt="contactus"
            style={{ width: "90%" }}
            loading="lazy"
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
          Aranya (अरण्य) is a Sanskrit word meaning "forest" or "wilderness," symbolizing nature, greenery, and purity. The brand aligns with eco-friendly, sustainable, and nature-connected values, making it a perfect fit for an environmentally conscious business. Aranya focuses on paper-based and eco-friendly products, with an emphasis on sustainable manufacturing and responsible sourcing.

          •	Industry: Paper & Stationery Manufacturing, Eco-friendly Products
          • Core Products: Notebooks, Paper Products, Corrugated Boxes (Bagasse-based)
          • Manufacturing Location: Gaya, Bihar,823001


          Aranya has a strong foundation with eco-conscious values and a structured business approach. The focus on sustainable materials, cost-effective production, and a growing market in Bihar makes this a promising venture.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;