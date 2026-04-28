import {Router} from 'express';
import { validate } from '../middleware/typeValidation';
import { authenticate, authorize } from '../middleware/auth';
import { deleteRoom, getRoom, updateRoom, updateRoomAmenities, updateRoomPricing } from '../controllers/roomController';
import { RoomIdSchema, RoomUpdateAmenities, RoomUpdateDetailsSchema, RoomUpdatePricing } from '../schemas/room.schema';
import { BedCreateSchema } from '../schemas/bed.schema';
import { createBed } from '../controllers/bedController';

const router = Router();

router.get("/single/:id", validate(RoomIdSchema as any), getRoom);
router.patch("/single/:id", authenticate, authorize(["host"]), validate(RoomUpdateDetailsSchema as any), updateRoom);
router.delete("/single/:id", authenticate, authorize(["host"]), validate(RoomIdSchema as any), deleteRoom);
router.put("/single/:id/pricing", authenticate, authorize(["host"]), validate(RoomUpdatePricing as any), updateRoomPricing);
router.put("/single/:id/amenities", authenticate, authorize(["host"]), validate(RoomUpdateAmenities as any), updateRoomAmenities);
router.post("/single/:id/beds", authenticate, authorize(["host"]), validate(BedCreateSchema as any), createBed);


export default router;