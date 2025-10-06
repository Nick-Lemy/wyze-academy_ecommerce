import { Router } from "express";
import { addUserController } from "../controllers/user.controller.js";
import { loginController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', addUserController);
authRouter.post('/login', loginController);

export default authRouter;