import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { upload } from "../middleware/fileUpload";
import { uploadFiles } from "../controllers/imageController";

const router = Router();

router.post("/upload", authenticate, authorize(["host"]), upload.array("images", 5), uploadFiles);

export default router;