import { Router } from "express";
import { addUserController, getUsersController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsersController);
userRouter.post('/', addUserController);

export default userRouter;