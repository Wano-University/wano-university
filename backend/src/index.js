import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
import menuRoutes from './routes/MenuRoutes.js'
import dishRoutes from './routes/DishRoutes.js'
import ticketRoutes from './routes/TicketRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});
