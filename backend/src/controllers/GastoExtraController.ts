import { Request, Response } from 'express';
import { prisma } from '../index';

export const createGastoExtra = async (req: Request, res: Response) => {
  const { mesId, concepto, monto, categoria, emoji, fecha, tipo, notas } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verificar que el mes pertenezca al usuario
    const mes = await prisma.mes.findUnique({
      where: { id: mesId, userId },
    });

    if (!mes) return res.status(403).json({ error: 'Forbidden' });

    const gasto = await prisma.gastoExtra.create({
      data: {
        mesId,
        concepto,
        monto,
        categoria,
        emoji,
        fecha,
        tipo,
        notas,
      },
    });
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateGastoExtra = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { concepto, monto, categoria, emoji, fecha, tipo, notas } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const gasto = await prisma.gastoExtra.update({
      where: { 
        id,
        mes: { userId } // Validación de propiedad
      },
      data: {
        concepto,
        monto,
        categoria,
        emoji,
        fecha,
        tipo,
        notas,
      },
    });
    res.json(gasto);
  } catch (error) {
    res.status(404).json({ error: 'Gasto not found or unauthorized' });
  }
};

export const deleteGastoExtra = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await prisma.gastoExtra.delete({ 
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

