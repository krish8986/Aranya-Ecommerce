import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import paymentRoute from './routes/paymentRoute.js';
import orderRoutes from "./routes/orderRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import logger from "./config/logger.js";
import path from "path";
import { fileURLToPath } from "url";

// configure env
dotenv.config();

// database config
connectDB();

// rest object
const app = express();
const httpServer = createServer(app);

// Socket.io setup
// const io = new Server(httpServer, {
// cors: {
// origin: process.env.CLIENT_URL || "http://localhost:3000",
// methods: ["GET", "POST"],
// credentials: true,
// },
// });

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://aranya-ecommerce-self.vercel.app",
      /\.vercel\.app$/,
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected via Socket.io".bgGreen.white);

  socket.on("disconnect", () => {
    console.log("User disconnected".bgRed.white);
  });
});

// Export io to use in other files
export { io };

// middlewares
app.set("trust proxy", 1);
// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://aranya-ecommerce-self.vercel.app",
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Strict limiter for auth routes (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // sirf 20 attempts
  message: { success: false, message: "Too many attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// routes
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use('/api/v1/payment', paymentRoute);
app.use("/api/v1/orders", orderRoutes);
// app.use("/api/v1/auth/login", authLimiter);
// app.use("/api/v1/auth/register", authLimiter);

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// PORT
const PORT = process.env.PORT || 8000;

// run listen — httpServer instead of app
// httpServer.listen(PORT, () => {
// logger.info(`Server Running on ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
// });

httpServer.listen(PORT, () => {
  logger.info(`Server Running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Keep Railway server alive
if (process.env.NODE_ENV === "production") {
  import("https").then(({ default: https }) => {
    setInterval(() => {
      https.get("https://aranya-ecommerce-production.up.railway.app", (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`);
      }).on("error", () => { });
    }, 14 * 60 * 1000);
  });
}