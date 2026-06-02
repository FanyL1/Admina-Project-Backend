import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { procedureTypeSchema } from '../utils/validations/schemas/procedureTypeSchem.js';

// Obtener todos los tipos de trámites
export const getProcedureTypes = async (req, res) => {
  try {
    const types = await prisma.typeProcedure.findMany({
      // include: { category: true } // Descomenta esta línea si quieres que al pedir el trámite también te traiga los datos de su categoría
    });
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los tipos de trámites' });
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

    const { name, requirements } = validation.data;
    const newType = await prisma.typeProcedure.create({
      data: {
        name,
        requirements,
      },
    });
    res.status(201).json(newType);
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

    const { name, requirements } = validation.data;
    const updatedType = await prisma.typeProcedure.update({
      where: { id: String(id) },
      data: {
        name,
        requirements,
      },
    });
    res.json(updatedType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el tipo de trámite' });
  }
};

// Eliminar un tipo de trámite
export const deleteProcedureType = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.typeProcedure.delete({
      where: { id: String(id) },
    });
    res.json({ message: 'Tipo de trámite eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el tipo de trámite' });
  }
};