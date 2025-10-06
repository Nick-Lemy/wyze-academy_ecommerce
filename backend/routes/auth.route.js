import { Router } from "express";
import { loginController, registerController, getCurrentUserController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/me', getCurrentUserController);

export default authRouter;