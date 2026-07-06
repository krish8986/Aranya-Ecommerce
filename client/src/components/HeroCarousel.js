import React, { useState, useEffect } from "react";

const slides = [
    {
        img: "/images/banner.jpg",
        title: "Weave Your Tale",
        subtitle: "100% Biodegradable & Sustainable Products",
    },
    {
        img: "/images/banner2.jpg",
        // title: "Eco-Friendly Living",
        // subtitle: "Premium tableware, made from nature",
    },
    {
        img: "/images/banner3.jpg",
        // title: "Built for the Planet",
        // subtitle: "Every product, zero waste",
    },
    {
        img: "/images/banner4.jpg",
        // title: "Nature, Reimagined",
        // subtitle: "Thoughtfully crafted from agricultural waste",
    },
    {
        img: "/images/banner5.jpg",
        // title: "Designed to Disappear",
        // subtitle: "Plastic-free products that return to nature",
    },
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "clamp(250px, 45vw, 480px)",
            overflow: "hidden",
        }}>
            {slides.map((slide, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%), url(${slide.img})`,
                        // backgroundSize: "cover",
                        backgroundSize: "contain",
                        backgroundColor: "#1B4332",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        opacity: current === i ? 1 : 0,
                        transition: "opacity 1.2s ease-in-out",
                    }}
                >
                    <div style={{
                        position: "absolute",
                        bottom: "10%",
                        left: "5%",
                        color: "#fff",
                        textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                        maxWidth: "90%",
                    }}>
                        <h2 style={{ fontSize: "clamp(20px, 4vw, 34px)", fontWeight: "700", margin: 0 }}>
                            {slide.title}
                        </h2>
                        <p style={{ fontSize: "clamp(12px, 2vw, 16px)", margin: "8px 0 0" }}>
                            {slide.subtitle}
                        </p>
                    </div>
                </div>
            ))}

            <div style={{
                position: "absolute",
                bottom: "16px",
                right: "5%",
                display: "flex",
                gap: "8px",
            }}>
                {slides.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: current === i ? "#52B788" : "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;