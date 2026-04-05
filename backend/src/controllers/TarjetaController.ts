import { Request, Response } from 'express';
import { prisma } from '../index';

export const listTarjetas = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const tarjetas = await prisma.tarjeta.findMany({
      where: { userId, activa: true },
    });
    res.json(tarjetas);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTarjeta = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { nombre, color } = req.body;
  try {
    const tarjeta = await prisma.tarjeta.create({
      data: {
        userId,
        nombre,
        color,
      },
    });
    res.json(tarjeta);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTarjeta = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, color, activa } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const tarjeta = await prisma.tarjeta.update({
      where: { id, userId }, // Validación de propiedad
      data: { nombre, color, activa },
    });
    res.json(tarjeta);
  } catch (error) {
    res.status(404).json({ error: 'Tarjeta not found or unauthorized' });
  }
};

export const deleteTarjeta = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Soft delete
    await prisma.tarjeta.update({
      where: { id, userId }, // Validación de propiedad
      data: { activa: false },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Tarjeta not found or unauthorized' });
  }
};
