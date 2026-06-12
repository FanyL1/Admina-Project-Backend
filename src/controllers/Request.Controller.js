// controllers/requestController.js
import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { requestSchema, observationSchema, updateStatusSchema } from '../utils/validations/schemas/requestSchem.js';
import { createAuditLog, isPrivilegedRole } from '../utils/auditLog.js';

// Obtener todas las solicitudes
export const getRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({});

    return res.json({
      success: true,
      message: "Solicitudes obtenidas exitosamente",
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Error en getRequests:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al obtener las solicitudes' 
    });
  }
};

// Obtener todas las solicitudes que no tengan el estado Aprobado y Rechazado
export const getAdminRequests = async (req, res) => {
  try {

    const {user_id} =req.params

    const requests = await prisma.request.findMany({
       where: { revisor_id: user_id  }
    });

    return res.json({
      success: true,
      message: "Solicitudes obtenidas exitosamente",
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Error en getRequests:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener las solicitudes' 
    });
  }
};

// Obtener una solicitud por ID
export const getOneRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.request.findFirst({
      where: { id: id },
       include: {
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true
          }
        },
        createByname: true,
        category: true,
        type: true,
        carrera: true,
        observation: true,
        updated_at: true,
        status: true,
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    return res.json({
      success: true,
      message: "Solicitud obtenida exitosamente",
      data: request
    });
  } catch (error) {
    console.error('Error en getOneRequest:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener la solicitud' 
    });
  }
};

// Obtener solicitudes por usuario
export const getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await prisma.request.findMany({
      where: { id: userId },
       include: {
        createByname: true,
        category: true,
        type: true,
        carrera: true,
        observation: true,
        updated_at: true,
        status: true,
      }
    });

    return res.json({
      success: true,
      message: "Solicitudes del usuario obtenidas exitosamente",
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Error en getRequestsByUser:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener las solicitudes del usuario' 
    });
  }
};

// Crear una nueva solicitud 
export const createRequest = async (req, res) => {
 
  try {
    let { user_id, createByname, type_id, carrera_id } = req.body;

    if (!createByname || createByname === 'undefined' || createByname === 'null') {
      createByname = "Mismo Usuario";
    }

    const requestData = {
      user_id,
      createByname,
      type_id,
      carrera_id,
    };

    const validation = await validate(requestSchema, requestData);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: validation.errors,
      });
    }

    //Validar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: requestData.user_id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Validar tipo de trámite (usando SQL para evitar error del JSON)
    const typeResult = await prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        category_id,
        status,
        requirements::text as requirements
      FROM core.type_procedure 
      WHERE id = ${type_id}::uuid 
      LIMIT 1
    `;
    
    if (!typeResult || typeResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de trámite no encontrado'
      });
    }
    
    // Parsear requirements de texto a JSON
    const typeData = {
      id: typeResult[0].id,
      name: typeResult[0].name,
      category_id: typeResult[0].category_id,
      status: typeResult[0].status,
      requirements: typeResult[0].requirements ? JSON.parse(typeResult[0].requirements) : []
    };

    // Validar que la carrera existe
    const carrera = await prisma.carrera.findFirst({
      where: { id: requestData.carrera_id }
    });

    if (!carrera) {
      return res.status(404).json({
        success: false,
        error: 'Carrera no encontrada'
      });
    }

    // Crear la solicitud
    const newRequest = await prisma.request.create({
      data: {
        user_id: requestData.user_id,
        createByname: requestData.createByname,
        type_id: requestData.type_id,
        carrera_id: requestData.carrera_id
      },
      include: {
        user: {select: { id: true, name: true,  lastname: true,  email: true }},
        carrera: { select: { id: true, name: true } }
      }
    });

    const responseData = {
      ...newRequest,
      type_procedure: typeData
    };

    if (isPrivilegedRole(req.user)) {
      await createAuditLog({
        user: req.user,
        action: 'CREO Solicitud',
        description: `(id: ${newRequest.id})`,
        resourceType: 'Request',
        resourceId: newRequest.id,
        requestId: newRequest.id
      });
    }

    console.log('Solicitud creada exitosamente:', responseData);
    return res.status(201).json({
      success: true,
      message: "Solicitud creada exitosamente",
      data: responseData
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Solicitud enviada" });
    }
    if (error.code === 'P2011') {
      return res.status(400).json({ error: "Error, se intentaron enviar campos nulos en Request" });
    }
    if (error.code === 'P2010') {
      return res.status(400).json({ error: "Tabla inexistente" });
    }

    console.error('Error en createRequest:', error);

    return res.status(500).json({ 
      success: false,
      error: 'Error al crear la solicitud' 
    });
  }

};

// Actualizar una solicitud
export const AddObservationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRequest = await prisma.request.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    const validation = await validate(observationSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validation.errors,
      });
    }
    const { observation, status } = validation.data;

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        observation: observation,
        status: status
      }
    });

    return res.json({
      success: true,
      message: "Solicitud actualizada exitosamente",
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error en updateRequest:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar la solicitud' 
    });
  }
};

// Cambiar estado de una solicitud
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingRequest = await prisma.request.findUnique({
      where: { id }
    });
    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    const validation = await validate(updateStatusSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validation.errors,
      });
    }

    const { status } = validation.data;

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status },
    });

    if (isPrivilegedRole(req.user)) {
      const actionLabel = status.toLowerCase().includes('rech')
        ? 'RECHAZO Solicitud'
        : status.toLowerCase().includes('apro')
          ? 'APROBO Solicitud'
          : 'CAMBIO ESTADO Solicitud';

      await createAuditLog({
        user: req.user,
        action: actionLabel,
        description: `(id: ${updatedRequest.id}) - Estado: ${updatedRequest.status}`,
        resourceType: 'Request',
        resourceId: updatedRequest.id,
        requestId: updatedRequest.id
      });
    }

    return res.json({
      success: true,
      message: `Estado actualizado a ${status}`,
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error en updateRequestStatus:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el estado' 
    });
  }
};
