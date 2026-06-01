import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({connectionString: `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({adapter});