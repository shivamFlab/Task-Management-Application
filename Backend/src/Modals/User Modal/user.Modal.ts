import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    loginEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    mobileNumber: { type: String },
    currentStatus: {
      type: String,
      enum: ["Not Started Yet", "Working...", "Completed"],
      default: "Not Started Yet",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//this code is for deencription
// using this "METHODS" basically we are adding methods in our userschema
UserSchema.methods.isPasswordCorrect = async function (password: any) {
  return await bcrypt.compare(password, this.password); // firstone is clear text password and second one is encripted password from data base we can access it by this also it returns true and false
};

// now we are genrating access tokens

UserSchema.methods.generateAccessToken = function () {
  //@ts-ignore
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// now we are genrating refresh token
UserSchema.methods.generateRefreshToken = function () {
  //@ts-ignore
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", UserSchema);
