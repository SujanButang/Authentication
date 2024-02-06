import mongoose from "mongoose";
import dotenv from "dotenv";

const path: string = __dirname + "/../../.env";

dotenv.config({ path: path });

const uri: string = process.env.MONGO_URI as string;
export const connectDB = async () => {
  await mongoose
    .connect(uri)
    .then(() => console.log("Database has been connected successfully! 🎉🎉"))
    .catch((err) => console.log("Unable to connect database. ☹️☹️", err));
};
