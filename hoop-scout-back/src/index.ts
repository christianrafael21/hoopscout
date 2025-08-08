import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import "express-async-errors";
import routers from "./routes/routers";
import errorHandler from "./middlewares/errorHandler";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const startServer = async () => {
    try {
      
      app.use(routers);
      app.use(errorHandler);

    } catch (error) {
      console.error("Error connecting to the database", error);
    }
  };
  
  startServer();

export default app;