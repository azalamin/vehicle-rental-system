import { Router } from "express";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", bookingControllers.createBooking);

export const bookingRoutes = router;
