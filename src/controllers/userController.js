import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { validate } from '../utils/validations/validate.js';
import { updateUserSchema, updateUserAdminSchema } from '../utils/validations/schemas/updateUserSchem.js';
import { onlyNameSchem } from '../utils/validations/schemas/onlyNameSchem.js';
import { createAuditLog, generatorDescription, isPrivilegedRole } from '../utils/auditLog.js';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
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
export const getUserById = async (req, res) => {
    try {
        const id = req.user?.id;

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
export const updateUser = async (req, res) => {
    try {

        const validation = await validate(updateUserSchema, req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                details: validation.errors,
            });
        }

        const id = req.params.id;
        const { name, lastname, email,dni, pass } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { id: id },
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
        })

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        const updateData = {};

        if (name !== undefined && name !== '') updateData.name = name;
        if (lastname !== undefined && lastname !== '') updateData.lastname = lastname;
        if (dni !== undefined && dni !== '') {
            const existingDniUser = await prisma.user.findFirst({
                where: { dni: dni }
            });
            if (existingDniUser) {
                return res.status(400).json({
                    success: false,
                    error: 'El DNI ya está en uso'
                });
            }
            updateData.dni = dni
        }
        if (email !== undefined && email !== '') {
            const existingEmailUser = await prisma.user.findFirst({
                where: { email: email }
            });
            if (existingEmailUser) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está en uso'
                });
            }
            updateData.email = email  
        }
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

        if (isPrivilegedRole(req.user)) {
         const detailsUpdate = generatorDescription(existingUser, updatedUser);
          await createAuditLog({
            user: req.user,
            action: 'MODIFICO Usuario',
            description: `Usuario actualizado. ${detailsUpdate}`,
            resourceType: 'User',
            resourceId: updatedUser.id
          });
        }

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

//Falta Actualizar usuario (solo Superusuario)
export const updateBySuperUser = async (req, res) => {
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

        const { name, lastname, email, dni, role, pass, status } = validation.data;
        const existingUser = await prisma.user.findUnique({
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
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (dni !== undefined && dni !== '') {
            if (dni == existingUser.dni) {
                return res.status(400).json({
                    success: false,
                    error: 'El DNI ya está en uso'
                });
            }
            updateData.dni = dni
        }
        if (email !== undefined && email !== '') {
            if (email == existingUser.email) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está en uso'
                });
            }
            updateData.email = email  
        }
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
        const detailsUpdate = generatorDescription(existingUser, updatedUser);
        await createAuditLog({
          user: req.user,
          action: 'MODIFICO Usuario',
          description: `Tramite actualizado. ${detailsUpdate}`,
          resourceType: 'User',
          resourceId: updatedUser.id
        });

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error en actualizar usuario:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// cambiar estado (cambiar estado de active a inactive)
export const UpadateStatuseUser = async (req, res) => {
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
            const reactivedUser = await prisma.user.update({
                where: { id },
                data: {
                    status: 'active'
                }
            });
            const detailsUpdate = generatorDescription(existingUser, reactivedUser);
            await createAuditLog({
              user: req.user,
              action: 'ACTIVO Usuario',
              description: `Usuario actualizado. ${detailsUpdate}`,
              resourceType: 'User',
              resourceId: reactivedUser.id
            });

            return  res.status(200).json({
                success: true,
                message: 'Usuario activado exitosamente',
                data: reactivedUser
            });
        }

        const activedUser = await prisma.user.update({
            where: { id },
            data: {
                status: 'inactive'
            }
        });
        const detailsUpdate = generatorDescription(existingUser, activedUser);
        await createAuditLog({
          user: req.user,
          action: 'DESACTIVO Usuario',
          description: `Usuario actualizado. ${detailsUpdate}`,
          resourceType: 'User',
          resourceId: activedUser.id
        });

        res.status(200).json({
            success: true,
            message: 'Usuario desactivado exitosamente',
            data: activedUser
        });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// cambiar rol
export const UpadateRoleUser = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = await validate(onlyNameSchem, req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validacion',
                details: validation.errors,
            });
        }
        const {name} = validation.data
        const existingUser = await prisma.user.findFirst({
            where: { id },
            include: {
                role: true 
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        const searchRole = await prisma.role.findUnique({
            where: { name : name }
        });

        if (!searchRole) {
            return res.status(404).JSON({
                success: false,
                error: 'Rol no encontrado'
            })
        }

        const updateRole = await prisma.user.update({
            where: { id },
            data: { rol_id: searchRole.id},
            include: {
                role: true 
            }
        });
        const detailsUpdate = generatorDescription(existingUser, updateRole);
        await createAuditLog({
          user: req.user,
          action: 'CAMBIO ROL Usuario',
          description: `Usuario actualizado. ${detailsUpdate}`,
          resourceType: 'User',
          resourceId: updateRole.id
        });

        res.status(200).json({
            success: true,
            message: 'Usuario desactivado exitosamente',
            data: updateRole
        });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtener estudiantes
export const getStudent = async (req, res) => {
    try {

        const roleStudent = await prisma.role.findUnique({
            where: {name: 'Estudiante'}
        })
        const users = await prisma.user.findMany({
            where: {
                rol_id: roleStudent.id
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
        });

        res.status(200).json({
            success: true,
            message: 'Estudiantes obtenidos exitosamente',
            data: users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

