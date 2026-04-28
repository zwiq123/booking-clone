import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/typeValidation";
import { BookingCreateSchema, BookingPaymentSchema } from "../schemas/booking.schema";
import { createBooking, getHostBookings, getUserBookings, payForBooking, updateBookings } from "../controllers/bookingController";

const router = Router();

router.post("/create", authenticate, authorize(["user"]), validate(BookingCreateSchema as any), createBooking);
router.post("/pay", authenticate, authorize(["user"]), validate(BookingPaymentSchema as any), payForBooking);
router.get("/", authenticate, authorize(["user"]), getUserBookings);
router.get("/host", authenticate, authorize(["host"]), getHostBookings);
router.patch("/update", updateBookings);

export default router;