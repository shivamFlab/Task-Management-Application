import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { User } from "../Modals/User Modal/user.Modal";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
//   console.log("Request received at VerifyJWT");
  try {
    const Token =
      req.header("Authorization")?.replace("Bearer ", "");


    if (!Token) {
      return res.status(400).json({
        success: false,
        message: "unAuthorised Access!!",
      });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      return res.status(402).json({
        success: false,
        message: "Secret not found.",
      });
    }
    const decodedToken = Jwt.verify(Token, secret) as { _id: string };
    if (!decodedToken) {
      return res.status(402).json({
        success: false,
        message: "something went wrong while decoding token.",
      });
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found!",
      });
    }

    // @ts-expect-error augmenting req with userId
    req.user = user._id;
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Jwt verify function is not working!!",
    });
  }
};

export { verifyJWT };
