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

app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/users', userRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/menu', menuRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/dishes', dishRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/tickets', ticketRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/sensors', sensorRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/mobilityResources', mobilityResourceRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/resources', resourceRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/reservations', reservationRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/payments', paymentRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});
app.use('/api/admin/users', adminRoutes);
app.use((req, res, next) => {
  console.log(`Recebido pedido: ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is securely running and listening on port ${PORT}`);

});
