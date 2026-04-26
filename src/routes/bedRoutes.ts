import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { getBedTypes } from "../controllers/bedController";

const router = Router();

router.get("/types", getBedTypes);

export default router;