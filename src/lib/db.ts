import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../db/schema";

// Initialize SQLite database
const sqlite = new Database("taskpilot.sqlite");

// Create Drizzle database instance
export const db = drizzle(sqlite, { schema });
