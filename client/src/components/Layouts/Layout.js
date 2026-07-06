import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';
import FloatingCart from "../FloatingCart";
import ScrollToTopButton from "./ScrollToTopButton";

const Layout = ({ children, title, description, keywords, author }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main style={{ minHeight: "70vh", paddingTop: "0" }}>
        <Toaster />
        {children}
      </main>
      <FloatingCart />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

Layout.defaultProps = {
  title: "Aranya-biodegradable tableware, notebook",
  description: "mern stack project",
  keywords: "mern, react, node, mongodb",
  author: "krishna kumar",
};

export default Layout;