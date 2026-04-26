import { Router } from "express";
import { changePropertyStatus, createProperty, getPropertiesHost, getPropertiesUser, getProperty, getPropertyHost, getPropertyReviews, getPropertyRooms } from "../controllers/propertyController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getPropertiesUser);
router.get("/host", getPropertiesHost);
router.get("/:id", getProperty);
router.get("/host/:id", authenticate, authorize(["host"]), getPropertyHost);

router.get("/:id/rooms", getPropertyRooms);
router.get("/:id/reviews", getPropertyReviews);

router.post("/", authenticate, authorize(["host"]), createProperty);
router.patch("/:id/status", authenticate, authorize(["host"]), changePropertyStatus);


export default router;