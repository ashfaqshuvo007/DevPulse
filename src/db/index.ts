import config from "../config";
import { Pool } from "pg";

const dbConnectionString = config.dbConnectionString;

export const connectionPool = new Pool({
  connectionString: dbConnectionString,
});

export const initializeDB = async () => {
  try {
    await connectionPool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL,
            email VARCHAR(40) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'contributor',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`);

    await connectionPool.query(`
        CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL CHECK (char_length(description) >= 20),
            type VARCHAR(20) NOT NULL,
            status VARCHAR(20) DEFAULT 'open',
            reporter_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`);
    console.log("DB Connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};
