import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { procedureTypeSchema } from '../utils/validations/schemas/procedureTypeSchem.js';
import { success } from 'zod';

// Obtener todos los tipos de trámites
export const getProcedureTypes = async (req, res) => {
  try {
    
// Validar tipo de trámite (usando SQL para evitar error del JSON)
    const typeResult = await prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        category_id,
        status,
        requirements::text as requirements
      FROM core.type_procedure 
      WHERE status = active
    `;
    
    if (typeResult.length === 0) {
      return res.status(404).json({
        success: true,
        error: 'No hay tramites registrados'
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
    return res.json({
      success: true,
      message: 'Tramites Obtenidos',
      data: typeData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al obtener los tipos de trámites' 
    });
  }
};

// Crear un tipo de trámite (Aquí guardamos el JSON)
export const createProcedureType = async (req, res) => {
  try {
    const validation = await validate(procedureTypeSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validation.errors,
      });
    }
    
    const { name, requirements, category_id } = validation.data;

    const newType = await prisma.typeProcedure.create({
      data: {
        name,
        requirements,
        category_id
      
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Tramite creado exitosamente',
      data: newType
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el tipo de trámite' });
  }
};

// Actualizar un tipo de trámite
export const updateProcedureType = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = await validate(procedureTypeSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validation.errors,
      });
    }

    const existingType = await prisma.typeProcedure.findUnique({
      where: { id }
    });

    if (!existingType) {
      return res.status(404).json({
        success: false,
        error: 'Trámite no encontrado'
      });
    }

    const { name, requirements } = validation.data;
    const updatedType = await prisma.typeProcedure.update({
      where: { id: id},
      data: {
        name,
        requirements,
      },
    });
    
    return res.json({
      success: true,
      message: 'Tramite actualizado exitosamente',
      data: updatedType
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el tipo de trámite' 
    });
  }
};
