import {Router} from 'express';
import { validate } from '../middleware/typeValidation';
import { authenticate, authorize } from '../middleware/auth';
import { deleteRoom, updateRoom, updateRoomAmenities, updateRoomPricing } from '../controllers/roomController';
import { RoomDeleteSchema, RoomUpdateAmenities, RoomUpdateDetailsSchema, RoomUpdatePricing } from '../schemas/room.schema';
import { BedCreateSchema } from '../schemas/bed.schema';
import { createBed } from '../controllers/bedController';

const router = Router();

router.patch("/single/:id", authenticate, authorize(["host"]), validate(RoomUpdateDetailsSchema), updateRoom);
router.delete("/single/:id", authenticate, authorize(["host"]), validate(RoomDeleteSchema), deleteRoom);
router.put("/single/:id/pricing", authenticate, authorize(["host"]), validate(RoomUpdatePricing), updateRoomPricing);
router.put("/single/:id/amenities", authenticate, authorize(["host"]), validate(RoomUpdateAmenities), updateRoomAmenities);
router.post("/single/:id/beds", authenticate, authorize(["host"]), validate(BedCreateSchema), createBed);


export default router;