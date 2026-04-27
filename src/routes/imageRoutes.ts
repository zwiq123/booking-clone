import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { upload } from "../middleware/fileUpload";
import { uploadImages, deleteImage, setImageMain } from "../controllers/imageController";
import { ImageIdSchema } from "../schemas/image.schema";
import { validate } from "../middleware/typeValidation";

const router = Router();

router.post("/upload", authenticate, authorize(["host"]), upload.array("images", 5), uploadImages);
router.delete("/single/:id", authenticate, authorize(["host"]), validate(ImageIdSchema), deleteImage);
router.put("/single/:id/setMain", authenticate, authorize(["host"]), validate(ImageIdSchema), setImageMain);

export default router;