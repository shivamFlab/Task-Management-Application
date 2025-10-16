import { Router } from "express";
import { loginUser, SignUpUser } from "../../Controllers/User Controller/user.Controller";


const userRouter = Router();

userRouter.post("/signup", SignUpUser);
userRouter.post("/login", loginUser);

userRouter.post("/register", SignUpUser);

export default userRouter;