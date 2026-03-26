import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import volunteerRoutes from "./routes/volunteerRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import editorImageUpload from "./routes/editorImageUpload.js";
import commentRoutes from "./routes/commentRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
dotenv.config();

const app = express();


// ================= MIDDLEWARE =================
app.use(express.json());

app.use(cors({
  origin: [
    "https://myhumrahi.org",
    "https://www.myhumrahi.org",
    "http://localhost:5173"
  ],
  credentials: true
}));


// ================= STATIC FILES =================
app.use("/certificates", express.static(path.join(process.cwd(), "certificates")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// ================= HEALTH ROUTES =================
app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

app.get("/api", (req, res) => {
  res.json({ message: "API root working" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API working" });
});


// ================= API ROUTES =================
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/test", testRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/contact", contactRoutes);
// ⚠️ KEEP SAME (NO BREAKING CHANGE)
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminDashboardRoutes);

// Upload routes
app.use("/api/upload-image", editorImageUpload);
app.use("/api/blog/upload-image", editorImageUpload);


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});


// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });


// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});    
