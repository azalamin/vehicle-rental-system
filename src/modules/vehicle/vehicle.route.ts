import { Router } from "express";
import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", auth(), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.delete("/:vehicleId", vehicleControllers.deleteVehicle);
router.put("/:vehicleId", vehicleControllers.updateVehicle);

export const vehicleRoutes = router;
