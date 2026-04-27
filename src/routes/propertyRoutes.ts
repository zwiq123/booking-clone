import { Router } from "express";
import { changePropertyStatus, createProperty, deleteProperty, getPropertiesHost, getPropertiesUser, getProperty, getPropertyHost, getPropertyReviews, getPropertyRooms, getPropertyTypes, updatePropertyAddress, updatePropertyAmenities, updatePropertyDetails } from "../controllers/propertyController";
import { authenticate, authorize } from "../middleware/auth";
import { validate, validateFloatBodyFields, validateIntBodyFields, validateIntParams } from "../middleware/typeValidation";
import { updatePropertyAmenitiesSchema } from "../schemas/property.schema";

const router = Router();

router.get("/", getPropertiesUser);
router.get("/host", getPropertiesHost);
router.get("/single/:id", validateIntParams(["id"]), getProperty);
router.get("/single/:id/host", authenticate, authorize(["host"]), validateIntParams(["id"]), getPropertyHost);

router.get("/single/:id/rooms", validateIntParams(["id"]), getPropertyRooms);
router.get("/single/:id/reviews", validateIntParams(["id"]), getPropertyReviews);

router.patch("/single/:id", authenticate, authorize(["host"]), validateIntParams(["id"]), validateIntBodyFields(["statusId", "propertyTypeId"]), updatePropertyDetails);
router.patch("/single/:id/address", authenticate, authorize(["host"]), validateIntParams(["id"]), validateFloatBodyFields(["latitude", "longitude"]), updatePropertyAddress);
router.put("/single/:id/amenities", authenticate, authorize(["host"]), validate(updatePropertyAmenitiesSchema), updatePropertyAmenities);
router.post("/", authenticate, authorize(["host"]), createProperty);
router.patch("/single/:id/status", authenticate, authorize(["host"]), validateIntParams(["id"]), changePropertyStatus);

router.delete("/single/:id", authenticate, authorize(["host"]), validateIntParams(["id"]), deleteProperty);

router.get("/types", getPropertyTypes);

export default router;