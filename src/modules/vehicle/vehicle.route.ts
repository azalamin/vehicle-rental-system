import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", auth(Roles.admin), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/:vehicleId", auth(Roles.admin), vehicleControllers.updateVehicle);
router.delete("/:vehicleId", auth(Roles.admin), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
