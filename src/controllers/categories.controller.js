import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { onlyNameSchem } from '../utils/validations/schemas/onlyNameSchem.js';
import { createAuditLog } from '../utils/auditLog.js';
import { exit } from 'node:process';
import { success } from 'zod';

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
      message: "Categoria actualizada exitosamente",
      data: updatedCategory
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

export const updateStatusCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findFirst({
      where:{ id}
    })

    if(!existingCategory){
      return res.status(404).json({
        success: false,
        error: 'Categoria no encontrada',
      })
    }
    if (existingCategory.status == 'active') {
      const updatedCategory = await prisma.category.update({
        where: { id: id },
        data: { 
          status: 'inactive'
       },
     }); 
     
      await createAuditLog({
        user: req.user,
        action: 'CAMBIO ESTADO - Inactivado - Categoria',
        description: updatedCategory.name,
        resourceType: 'Category',
        resourceId: updatedCategory.id
      });
      return res.json({
        success: true,
        message: 'Categoria actualizada',
        data: updatedCategory
      })
    }

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: { status: 'active' },
    });

    await createAuditLog({
      user: req.user,
      action: 'CAMBIO ESTADO - Activado - Categoria',
      description: updatedCategory.name,
      resourceType: 'Category',
      resourceId: updatedCategory.id
    });
    
     return res.json({
      success: true,
      message: "Categoria actualizada exitosamente",
      data: updatedCategory
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};