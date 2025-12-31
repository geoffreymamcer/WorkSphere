import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Fail fast if critical config is missing
if (!env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

if (!env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables.");
}
