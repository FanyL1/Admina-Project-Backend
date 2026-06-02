import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { onlyNameSchem } from '../utils/validations/schemas/onlyNameSchem.js';

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
        const user = await prisma.role.create({
            data: { name },
        });

        res.status(200).json({ message: "Rol creado", user });
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

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            return res.status(404).json({ error: "Rol no encontrado" });
        }
        res.status(200).json({ message: "Rol obtenido", role });
    }
        catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createRole,
    getAllRoles
};