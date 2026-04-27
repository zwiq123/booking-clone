import { Router } from "express";
import { changePropertyStatus, createProperty, deleteProperty, getPropertiesHost, getPropertiesUser, getProperty, getPropertyHost, getPropertyReviews, getPropertyRooms, getPropertyTypes, updatePropertyAddress, updatePropertyAmenities, updatePropertyDetails } from "../controllers/propertyController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/typeValidation";
import { PropertyCreateSchema, PropertyGetUserSchema, PropertyIdSchema, PropertyUpdateAddressSchema, PropertyUpdateAmenitiesSchema, PropertyUpdateDetailsSchema, PropertyUpdateStatusSchema } from "../schemas/property.schema";
import { createRooms } from "../controllers/roomController";
import { RoomCreateSchema } from "../schemas/room.schema";
import { getPropertyImages } from "../controllers/imageController";

const router = Router();

router.get("/", validate(PropertyGetUserSchema), getPropertiesUser);
router.get("/host", authenticate, authorize(["host"]), getPropertiesHost);
router.get("/single/:id", validate(PropertyIdSchema), getProperty);
router.get("/single/:id/host", authenticate, authorize(["host"]), validate(PropertyIdSchema), getPropertyHost);

router.get("/single/:id/images", validate(PropertyIdSchema), getPropertyImages);
router.get("/single/:id/rooms", validate(PropertyIdSchema), getPropertyRooms);
router.get("/single/:id/reviews", validate(PropertyIdSchema), getPropertyReviews);

router.post("/", authenticate, authorize(["host"]), validate(PropertyCreateSchema), createProperty);
router.post("/:id/rooms", authenticate, authorize(["host"]), validate(RoomCreateSchema), createRooms);

router.patch("/single/:id", authenticate, authorize(["host"]), validate(PropertyUpdateDetailsSchema), updatePropertyDetails);
router.patch("/single/:id/address", authenticate, authorize(["host"]), validate(PropertyUpdateAddressSchema), updatePropertyAddress);
router.put("/single/:id/amenities", authenticate, authorize(["host"]), validate(PropertyUpdateAmenitiesSchema), updatePropertyAmenities);
router.put("/single/:id/status", authenticate, authorize(["host"]), validate(PropertyUpdateStatusSchema), changePropertyStatus);

router.delete("/single/:id", authenticate, authorize(["host"]), validate(PropertyIdSchema), deleteProperty);

router.get("/types", getPropertyTypes);

export default router;