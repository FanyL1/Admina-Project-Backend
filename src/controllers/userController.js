import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import {validate} from '../utils/validations/validate.js';
import {updateUserSchema, updateUserAdminSchema} from '../utils/validations/schemas/updateUserSchem.js';

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                status: 'active'
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                dni: true,
                email: true,
                status: true,
                created_at: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error en obtener usuarios:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                lastname: true,
                dni: true,
                email: true,
                status: true,
                created_at: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: user
        });
    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Actualizar usuario (1 o varios datos)
const updateUser = async (req, res) => {
    try {

        const validation = await validate(updateUserSchema, req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                details: validation.errors,
            });
        }
        const { id } = req.params;
        const { name, lastname, email, pass } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id }
                }
            });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está en uso'
                });
            }
        }

        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (email !== undefined) updateData.email = email; 
        if (pass !== undefined && pass !== '') {
            updateData.pass = await bcrypt.hash(pass, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No hay datos para actualizar'
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                lastname: true,
                dni: true,
                email: true,
                created_at: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error en updateUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//Falta Actualizar usuario (solo admin)
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = await validate(updateUserAdminSchema, req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                details: validation.errors,
            });
        }

        const { name, lastname, email, dni, role, pass, status } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id }
                }
            });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está en uso'
                });
            }
        }
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (email !== undefined) updateData.email = email;
        if (dni !== undefined) updateData.dni = dni;
        if (role !== undefined) updateData.rol_id = role;
        if (pass !== undefined && pass !== '') {
            updateData.pass = await bcrypt.hash(pass, 10);
        }
        if (status !== undefined) updateData.status = status;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No hay datos para actualizar'
            });
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                lastname: true,
                dni: true,
                email: true,
                status: true,
                created_at: true,
                role: {
                    select: {   
                        id: true,
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error en updateUserByAdmin:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Eliminar usuario (cambiar estado de active a inactive)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (existingUser.status === 'inactive') {
            return res.status(400).json({
                success: false,
                error: 'El usuario ya está inactivo'
            });
        }

        const deletedUser = await prisma.user.update({
            where: { id },
            data: {
                status: 'inactive'
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                status: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Usuario desactivado exitosamente',
            data: deletedUser
        });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtener usuarios inactivos (solo admin)
const getInactiveUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                status: 'inactive'
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                dni: true,
                email: true,
                status: true,
                created_at: true,
                updated_at: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                updated_at: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Usuarios inactivos obtenidos exitosamente',
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error en getInactiveUsers:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getInactiveUsers,
    updateUserByAdmin
}