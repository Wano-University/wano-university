import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
import menuRoutes from './routes/MenuRoutes.js';
import dishRoutes from './routes/DishRoutes.js';
import ticketRoutes from './routes/TicketRoutes.js';
import sensorRoutes from './routes/SensorRoutes.js';
import mobilityResourceRoutes from './routes/MobilityResourceRoutes.js';
import resourceRoutes from './routes/ResourceRoutes.js';
import reservationRoutes from './routes/ReservationRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import simulationRoutes from './routes/SimulationRoutes.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/AdminRoutes.js'; // Substitui pelo nome correto do ficheiro se for diferente

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/users', userRoutes);

app.use('/api/menu', menuRoutes);

app.use('/api/dishes', dishRoutes);

app.use('/api/tickets', ticketRoutes);

app.use('/api/sensors', sensorRoutes);

app.use('/api/mobilityResources', mobilityResourceRoutes);

app.use('/api/resources', resourceRoutes);

app.use('/api/reservations', reservationRoutes);

app.use('/api/payments', paymentRoutes);

app.use('/api/admin/users', adminRoutes);

app.use('/api/dashboard', simulationRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is securely running and listening on port ${PORT}`);
});
