import express from "express";
import { upload } from "./middleware/fileUpload";
import path from "path";
import { authorize, authenticate } from "./middleware/auth";
import userRoutes from "./routes/userRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import imageRoutes from "./routes/imageRoutes";

const PORT = 3000;
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/images", imageRoutes);

app.get("/", authenticate, authorize(["user"]), (req, res) => {
    res.send("hello world");
})

// const calculateDistance = 
//     (location1: {latitude: number, longitude: number}, 
//      location2: {latitude: number, longitude: number}) => {
    
//     // E/W  S/N

//     return 1;
// }

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
