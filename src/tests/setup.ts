import * as dotenv from "dotenv";
import { Pool } from "pg";

// Load environment variables
dotenv.config();

export const testDb = new Pool();
