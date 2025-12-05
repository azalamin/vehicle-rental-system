import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", auth(Roles.admin), userControllers.getUsers);
router.put("/:userId", auth(Roles.admin, Roles.customer), userControllers.updateUser);
router.delete("/:userId", auth(Roles.admin), userControllers.deleteUser);

export const userRoutes = router;
