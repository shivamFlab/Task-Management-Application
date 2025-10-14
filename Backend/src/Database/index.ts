
import mongoose from "mongoose";

console.log("data url->",process.env.MONGO_DB_URL)
const connectDB = async () => {
  try {
    const connectionInstances = await mongoose.connect(
      `${process.env.MONGO_DB_URL}/${process.env.DB_NAME}`
    ); 
    console.log(
      `DATABASE Connection succesfull with ${process.env.DB_NAME} !! DB_HOST:${connectionInstances.connection.host}`
    );
  } catch (error) {
    console.log(`Error in Connectin DataBase: + ${error}`);
    process.exit(1);
  }
};

export default connectDB;
