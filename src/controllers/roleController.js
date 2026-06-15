import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { onlyNameSchem } from '../utils/validations/schemas/onlyNameSchem.js';
import { createAuditLog } from '../utils/auditLog.js';

// Este endpoint es para desarrollo no está disponible la 
// opción de crear roles en el producto final
const createRole = async (req, res) => {
    try {
        const validation = await validate(onlyNameSchem, req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.errors,
            });
        }
        const { name } = validation.data;
        const role = await prisma.role.create({
            data: { name },
        });

        await createAuditLog({
          user: req.user,
          action: 'CREO Rol',
          description: role.name,
          resourceType: 'Role',
          resourceId: role.id
        });

        res.status(200).json({ message: 'Rol creado', role });
    } catch (error) {
        
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Rol ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.status(200).json({ message: "Roles obtenidos", roles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const UpdateRole = async (req, res) => {
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

        const searchRole = await prisma.role.findUnique({
            where: { name : name } 
        });

        if (searchRole) {
            return res.status(400).json({
                success: false,
                error: 'Rol ya registrado'
            });
        }

        const updateRole = await prisma.role.update({
            where: { id },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        await createAuditLog({
          user: req.user,
          action: 'MODIFICO Rol',
          description: updateRole.name,
          resourceType: 'Role',
          resourceId: updateRole.id
        });

        res.status(200).json({
            success: true,
            message: 'Rol actualizado exitosamente',
            data: updateRole
        });
    } catch (error) {
        console.error('Error en updateRole:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export default {
    createRole,
    getAllRoles,
    UpdateRole
};