import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import volunteerRoutes from "./routes/volunteerRoutes.js";

// ✅ ADD THIS
import donationRoutes from "./routes/donationRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import editorImageUpload from "./routes/editorImageUpload.js";
import commentRoutes from "./routes/commentRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://myhumrahi.org", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API working" });
});
app.get("/api", (req, res) => {
  res.json({ message: "API root working" });
});
app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.use("/api/volunteers", volunteerRoutes);

app.use("/api/donations", donationRoutes);
app.use("/certificates", express.static("certificates"));
app.use("/api/otp", otpRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use(

"/api/gallery",

galleryRoutes

);


app.use(

"/uploads",

express.static("uploads")
);

app.use("/api/blog", blogRoutes);




app.use("/api/admin",adminAuthRoutes);
app.use("/api/admin", adminDashboardRoutes);

app.use("/api/upload-image", editorImageUpload);
app.use("/api/blog/upload-image", editorImageUpload);



app.use("/api/comments", commentRoutes);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});