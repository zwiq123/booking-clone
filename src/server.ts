import express from "express";
import path from "path";
import { authorize, authenticate } from "./middleware/auth";
import userRoutes from "./routes/userRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import imageRoutes from "./routes/imageRoutes";
import amenityRoutes from "./routes/amenityRoutes";
import bedRoutes from "./routes/bedRoutes";
import languageRoutes from "./routes/languageRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import roomRoutes from "./routes/roomRoutes";

const PORT = 3000;
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/amenities", amenityRoutes);
app.use('/api/beds', bedRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", authenticate, authorize(["user"]), (req, res) => {
    res.send("hello world");
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
