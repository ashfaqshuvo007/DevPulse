import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  apiUrl: `/${process.env.BASE_URL}`,
  dbConnectionString: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
};

export default config;
