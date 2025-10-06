import { Router } from "express";
import { addUserController, getUserByIdController, getUsersController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsersController);
userRouter.post('/', addUserController);
userRouter.get('/:id', getUserByIdController);

export default userRouter;