import { User } from "../../Modals/User Modal/user.Modal";

const SignUpUser = async (req: any, res: any) => {
  try {
    console.log("Received signup request", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const userExists = await User.findOne({ loginEmail: email });

    if (userExists) {
      console.log("User already exists with email:", email);
      return res.status(409).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const user = await User.create({
      username,
      loginEmail: email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      console.error("Failed to retrieve created user");
      return res.status(500).json({
        message: "Failed to create user. Please try again.",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Signup Successful",
      success: true,
      user: createdUser,
    });
  } catch (error) {
    console.error("Error in SignUpUser:", error);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again.",
      success: false,
    });
  }
};

const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ loginEmail: email });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const { accesstoken, refreshtoken } = await GenerateAccessAndRefreshTokens(
    user._id
  );

  const loggedinuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  return res.status(200).json({
    message: "User Logged In Successfully",
    user: loggedinuser,
    success: true,
    token: accesstoken,
    refreshToken: refreshtoken,
  });
};

const GenerateAccessAndRefreshTokens = async (userid:any) => {
  try {
    const user = await User.findById(userid);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    console.log("Error is:", error);

    throw new Error("Failed to generate tokens");
  }
};

export { loginUser, SignUpUser };
