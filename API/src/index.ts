import express from "express";
import cors from "cors";
import routes from "./routes/index.route";

import dotenv from "dotenv";
import { connectDB } from "./database/connection";
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

app.use("/api",routes);

app.listen(serverPort, async () => {
  await connectDB();
  console.log(`Server has started on http://localhost:${serverPort}`);
});
