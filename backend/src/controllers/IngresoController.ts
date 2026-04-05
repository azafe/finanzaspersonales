import { Request, Response } from 'express';
import { prisma } from '../index';

export const createIngreso = async (req: Request, res: Response) => {
  const { mesId, label, monto, fechaCobro, notas } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verificar que el mes pertenezca al usuario
    const mes = await prisma.mes.findUnique({
      where: { id: mesId, userId },
    });

    if (!mes) return res.status(403).json({ error: 'Forbidden' });

    const ingreso = await prisma.ingreso.create({
      data: {
        mesId,
        label,
        monto,
        fechaCobro,
        notas,
      },
    });
    res.json(ingreso);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateIngreso = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { label, monto, fechaCobro, notas, activo } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const ingreso = await prisma.ingreso.update({
      where: { 
        id,
        mes: { userId } // Validación de propiedad
      },
      data: {
        label,
        monto,
        fechaCobro,
        notas,
        activo,
      },
    });
    res.json(ingreso);
  } catch (error) {
    res.status(404).json({ error: 'Ingreso not found or unauthorized' });
  }
};

export const deleteIngreso = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await prisma.ingreso.delete({ 
      where: { 
        id,
        mes: { userId } // Validación de propiedad
      } 
    });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Ingreso not found or unauthorized' });
  }
};

