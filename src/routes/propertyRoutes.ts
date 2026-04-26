import { Router } from "express";
import { changePropertyStatus, createProperty, getPropertiesHost, getPropertiesUser, getProperty, getPropertyHost, getPropertyReviews, getPropertyRooms, getPropertyTypes } from "../controllers/propertyController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getPropertiesUser);
router.get("/host", getPropertiesHost);
router.get("/single/:id", getProperty);
router.get("/single/:id/host", authenticate, authorize(["host"]), getPropertyHost);

router.get("/single/:id/rooms", getPropertyRooms);
router.get("/single/:id/reviews", getPropertyReviews);

router.post("/", authenticate, authorize(["host"]), createProperty);
router.patch("/single/:id/status", authenticate, authorize(["host"]), changePropertyStatus);

router.get("/types", getPropertyTypes);

export default router;