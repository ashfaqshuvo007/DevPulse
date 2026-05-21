import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";

const app: Application = express();

const BASE_URL = config.apiUrl;

//Root
app.get(BASE_URL + "/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse app running! Health OK!",
  });
});

export default app;
