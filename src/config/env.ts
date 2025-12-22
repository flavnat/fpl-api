import "dotenv/config";
import z from "zod";

export const env = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().default(3000),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    DATABASE_URL_LOCAL: z.string(),
    DATABASE_URL_DEV: z.string(),
    DATABASE_URL_PROD: z.string()
}).parse(process.env)