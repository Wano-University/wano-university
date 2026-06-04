import dotenv from 'dotenv';
dotenv.config()


import express from 'express';

import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
import menuRoutes from './routes/MenuRoutes.js';
import dishRoutes from './routes/DishRoutes.js';
import ticketRoutes from './routes/TicketRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import prisma from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/test', (req, res) => {
  console.log('TEST HIT');
  res.send('working');
});

app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("ENV PORT:", process.env.PORT);
 try {
    await prisma.$connect();
const result = await prisma.$queryRaw`SELECT current_database()`;
console.log(result);
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
});
