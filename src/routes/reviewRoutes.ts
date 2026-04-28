import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/typeValidation";
import { ReviewCreateSchema, ReviewDeleteSchema } from "../schemas/review.schema";
import { createReview, deleteReview } from "../controllers/reviewController";

const router = Router();

router.post("/", authenticate, authorize(["user"]), validate(ReviewCreateSchema as any), createReview);
router.delete("/single/:id", authenticate, authorize(["user"]), validate(ReviewDeleteSchema as any), deleteReview);

export default router;