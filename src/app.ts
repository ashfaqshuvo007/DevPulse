import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";

const app: Application = express();

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.text());

const BASE_URL = config.apiUrl;

//Root
app.get(BASE_URL + "/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse app running! Health OK!",
  });
});

//* Routes
app.use(BASE_URL + "/auth", authRouter);
app.use(BASE_URL + "/issues", issueRouter);

export default app;
