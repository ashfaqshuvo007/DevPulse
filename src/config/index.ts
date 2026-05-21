import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  apiUrl: `/${process.env.BASE_URL}/${process.env.API_VERSION}`,
  dbConnectionString: process.env.DB_URL,
};

export default config;
