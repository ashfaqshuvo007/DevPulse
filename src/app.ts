import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";
import CookieParser from "cookie-parser";
import globalErrorHandler from "./middleware/globalErrorHandler";
import sendResponse from "./utils/sendResponse";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(CookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const corsOptions = {
  origin: [
    `http://localhost:${config.port}/`,
    `https://devpulse-api-one.vercel.app/`,
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

const BASE_URL = config.apiUrl;

//Root
app.get(BASE_URL + "/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "DevPulse app running! Health OK!",
    data: {},
  });
});

//* Routes
app.use(BASE_URL + "/auth", authRouter);
app.use(BASE_URL + "/issues", issueRouter);

app.use(globalErrorHandler);
export default app;
