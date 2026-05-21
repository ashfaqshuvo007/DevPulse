import app from "./app";
import config from "./config";
import { initializeDB } from "./db";

const main = () => {
  app.listen(config.port, () => {
    console.log(`DevPulse app listening on port ${config.port}`);
  });
  // Initialize DB
  initializeDB();
};

main();
