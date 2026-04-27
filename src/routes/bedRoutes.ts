import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { deleteBed, getBedTypes, updateBed } from "../controllers/bedController";
import { BedDeleteSchema, BedUpdateSchema } from "../schemas/bed.schema";
import { validate } from "../middleware/typeValidation";

const router = Router();

router.get("/types", getBedTypes);
router.delete("/single/:id", authenticate, authorize(["host"]), validate(BedDeleteSchema), deleteBed);
router.patch("/single/:id", authenticate, authorize(["host"]), validate(BedUpdateSchema), updateBed);

export default router;