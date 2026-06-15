import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { onlyNameSchem } from '../utils/validations/schemas/onlyNameSchem.js';
import { createAuditLog } from '../utils/auditLog.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany(); // Ajusta 'category' si es necesario

    return res.json({
      success: true,
      message: "Categoria obtenida exitosamente",
      data: categories
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const validation = await validate(onlyNameSchem, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validation.errors,
      });
    }

    const { name } = validation.data;
    
    const newCategory = await prisma.category.create({
      data: { name }
    });

    await createAuditLog({
      user: req.user,
      action: 'CREO Categoría',
      description: newCategory.name,
      resourceType: 'Category',
      resourceId: newCategory.id
    });

    return res.status(201).json({
      success: true,
      message: "Categoria creada exitosamente",
      data: newCategory
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = await validate(onlyNameSchem, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validation.errors,
      });
    }

    const { name } = validation.data;
    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: { name },
    });

    await createAuditLog({
      user: req.user,
      action: 'MODIFICO Categoría',
      description: updatedCategory.name,
      resourceType: 'Category',
      resourceId: updatedCategory.id
    });
    
     return res.json({
      success: true,
      message: "Categoria creada exitosamente",
      data: updatedCategory
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};
