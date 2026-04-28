import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { deleteBed, getBedTypes, updateBed } from "../controllers/bedController";
import { BedDeleteSchema, BedUpdateSchema } from "../schemas/bed.schema";
import { validate } from "../middleware/typeValidation";

const router = Router();

router.get("/types", getBedTypes);
router.delete("/single/:id", authenticate, authorize(["host"]), validate(BedDeleteSchema as any), deleteBed);
router.patch("/single/:id", authenticate, authorize(["host"]), validate(BedUpdateSchema as any), updateBed);

export default router;