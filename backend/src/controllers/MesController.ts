import { Request, Response } from 'express';
import { prisma } from '../index';

export const getMes = async (req: Request, res: Response) => {
  const { year, month } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const y = parseInt(year);
  const m = parseInt(month);

  try {
    let mes = await prisma.mes.findUnique({
      where: {
        userId_year_month: {
          userId,
          year: y,
          month: m,
        },
      },
      include: {
        ingresos: true,
        gastosFijos: true,
        gastosExtra: true,
        resumenes: {
          include: {
            tarjeta: true,
            gastos: true,
          },
        },
      },
    });

    if (!mes) {
      // Lógica de generación automática
      // Buscamos el mes anterior para copiar datos
      const prevMonth = m === 1 ? 12 : m - 1;
      const prevYear = m === 1 ? y - 1 : y;

      const mesAnterior = await prisma.mes.findUnique({
        where: {
          userId_year_month: {
            userId,
            year: prevYear,
            month: prevMonth,
          },
        },
        include: {
          ingresos: true,
          gastosFijos: true,
        },
      });

      // Crear nuevo mes
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      mes = await prisma.mes.create({
        data: {
          userId,
          year: y,
          month: m,
          label: `${monthNames[m-1]} ${y}`,
          ingresos: {
            create: mesAnterior?.ingresos.map(i => ({
              label: i.label,
              monto: i.monto,
              fechaCobro: i.fechaCobro,
              notas: i.notas,
            })) || [],
          },
          gastosFijos: {
            create: mesAnterior?.gastosFijos.map(g => ({
              servicio: g.servicio,
              categoria: g.categoria,
              monto: g.monto,
              notas: g.notas,
            })) || [],
          },
        },
        include: {
          ingresos: true,
          gastosFijos: true,
          gastosExtra: true,
          resumenes: {
            include: {
              tarjeta: true,
              gastos: true,
            },
          },
        },
      });
    }

    res.json(mes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listMeses = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const meses = await prisma.mes.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    res.json(meses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
