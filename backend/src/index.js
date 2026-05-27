import express from 'express';
import menuRoutes from './routes/MenuRoutes.js';
import dishRoutes from './routes/DishRoutes.js';
import ticketRoutes from './routes/TicketRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/menu', menuRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/tickets', ticketRoutes);

export default app;