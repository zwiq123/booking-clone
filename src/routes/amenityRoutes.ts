import { Router } from "express";
import { getPropertyAmenityTypes, getRoomAmenityCategories, getRoomAmenityTypes } from "../controllers/amenityController";

const router = Router();

router.get("/room/types", getRoomAmenityTypes);
router.get("/room/categories", getRoomAmenityCategories);
router.get("/property/types", getPropertyAmenityTypes);

export default router;