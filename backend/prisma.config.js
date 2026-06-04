import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenv.config();
console.log("DB URL" ,env('DATABASE_URL'))

export default defineConfig({
  datasource: {
    
    url: env('DATABASE_URL'),
  },
});
