import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", auth(Roles.admin, Roles.customer), bookingControllers.createBooking);
router.get("/", auth(Roles.admin, Roles.customer), bookingControllers.getAllBooking);
router.put("/:bookingId", auth(Roles.admin, Roles.customer), bookingControllers.updateBooking);

export const bookingRoutes = router;
