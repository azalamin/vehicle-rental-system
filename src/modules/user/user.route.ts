import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", userControllers.getUsers);
router.put("/:userId", userControllers.updateUser);

export const userRoutes = router;
