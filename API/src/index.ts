import express from "express";
import cors from "cors";

import router from "./routes/indexRoute";

import dotenv from "dotenv";
import { connectDB } from "./database/connection";
import { genericErrorHandler, notFoundError } from "./middlewares/errorHandler";
dotenv.config();

const app = express();
const serverPort = process.env.SERVER_PORT;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use("/api", router);

app.use(genericErrorHandler);
app.use(notFoundError);

app.listen(serverPort, async () => {
  await connectDB();
  console.log(`Server has started on http://localhost:${serverPort}`);
});
