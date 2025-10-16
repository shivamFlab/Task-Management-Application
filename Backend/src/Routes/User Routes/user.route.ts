import { Router } from "express";
import { loginUser, SignUpUser } from "../../Controllers/User Controller/user.Controller";


const userRouter = Router();

// Legacy endpoints remain available under /api/v1/user
userRouter.post("/signup", SignUpUser);
userRouter.post("/login", loginUser);

// Spec-compliant aliases when mounted at /api/auth
userRouter.post("/register", SignUpUser);

export default userRouter;