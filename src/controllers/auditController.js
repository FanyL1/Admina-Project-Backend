import prisma from '../config/prisma.js';

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
            role: { select: { name: true } }
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Logs de auditoría obtenidos correctamente',
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Error en getAuditLogs:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener los logs de auditoría'
    });
  }
};
