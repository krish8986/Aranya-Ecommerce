# 🌿 Aranya — Eco-Friendly E-Commerce Platform

A production-grade full-stack e-commerce platform built with the MERN stack, featuring real-time order tracking, Redis caching, and secure payment processing.

## 🔗 Live Demo
**[View Live →](https://aranya-production.up.railway.app)**

## 📸 Screenshots
<!-- Add screenshots here -->

## ⚡ Key Features
- **Redis Caching** — 20x faster API response time on product listings
- **Real-time Order Tracking** — Socket.io WebSockets (like Swiggy/Zomato)
- **JWT Refresh Token System** — Secure auth with httpOnly cookies, 15min access tokens
- **Cloudinary Image Upload** — Production-grade image storage (not in DB)
- **Razorpay Payment** — With idempotency check to prevent duplicate orders
- **Email Notifications** — Order confirmation, status updates, delivery alerts via Nodemailer
- **OTP Email Verification** — On registration with 10-min expiry and resend support
- **Admin Analytics Dashboard** — MongoDB Aggregation Pipeline (revenue, top products, order status)
- **Zod Validation** — Backend + frontend validation with error messages
- **Winston Logging** — Production-level logging to files
- **Soft Delete** — Products hidden not deleted (preserves order history)
- **Per-route Rate Limiting** — Strict 5 req/15min on auth routes (brute-force protection)
- **Product Reviews & Ratings** — With star UI and average calculation

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Ant Design, Socket.io-client |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Cache | Redis (ioredis) |
| Auth | JWT (Access + Refresh tokens) |
| Payments | Razorpay |
| Images | Cloudinary |
| Email | Nodemailer |
| Validation | Zod |
| Logging | Winston |
| Containerization | Docker + docker-compose |

## 🚀 Run Locally

### Prerequisites
- Node.js 20+
- MongoDB
- Redis

### With Docker (Recommended)
```bash
git clone https://github.com/yourusername/aranya
cd aranya
cp .env.example .env  # fill in your values
docker compose up
```

### Without Docker
```bash
# Backend
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm start
```

## 🔑 Environment Variables