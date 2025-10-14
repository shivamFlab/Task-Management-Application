import { app } from "./app.js";
import connectDB from "./Database/index.js";

connectDB().then(() => {
  try {
    app.listen(`${process.env.PORT}` || 4000, () => {
      console.log(`Server is Up and Running at ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server Down");
  }
});