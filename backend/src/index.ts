import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import mesRoutes from './routes/mesRoutes';
import ingresoRoutes from './routes/ingresoRoutes';
import gastoFijoRoutes from './routes/gastoFijoRoutes';
import gastoExtraRoutes from './routes/gastoExtraRoutes';
import tarjetaRoutes from './routes/tarjetaRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/meses', mesRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/gastos-fijos', gastoFijoRoutes);
app.use('/api/gastos-extra', gastoExtraRoutes);
app.use('/api/tarjetas', tarjetaRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };
