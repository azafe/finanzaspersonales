import { Request, Response } from 'express';
import { prisma } from '../index';

export const createGastoFijo = async (req: Request, res: Response) => {
  const { mesId, servicio, categoria, monto, notas } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verificar que el mes pertenezca al usuario
    const mes = await prisma.mes.findUnique({
      where: { id: mesId, userId },
    });

    if (!mes) return res.status(403).json({ error: 'Forbidden' });

    const gasto = await prisma.gastoFijo.create({
      data: {
        mesId,
        servicio,
        categoria,
        monto,
        notas,
      },
    });
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateGastoFijo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { servicio, categoria, monto, paid, notas } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const gasto = await prisma.gastoFijo.update({
      where: { 
        id,
        mes: { userId } // Validación de propiedad
      },
      data: {
        servicio,
        categoria,
        monto,
        paid,
        notas,
      },
    });
    res.json(gasto);
  } catch (error) {
    res.status(404).json({ error: 'Gasto not found or unauthorized' });
  }
};

export const deleteGastoFijo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await prisma.gastoFijo.delete({ 
      where: { 
        id,
        mes: { userId } // Validación de propiedad
      } 
    });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Gasto not found or unauthorized' });
  }
};

export const togglePaid = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const current = await prisma.gastoFijo.findFirst({ 
      where: { 
        id,
        mes: { userId } // Validación de propiedad
      } 
    });

    if (!current) return res.status(404).json({ error: 'Not found or unauthorized' });

    const gasto = await prisma.gastoFijo.update({
      where: { id },
      data: { paid: !current.paid },
    });
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

