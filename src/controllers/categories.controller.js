import prisma from '../config/prisma.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany(); // Ajusta 'category' si es necesario
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: String(id) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: String(id) },
    });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};