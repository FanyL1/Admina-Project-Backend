import prisma from '../config/prisma.js';
import bcryptjs from 'bcryptjs';
import { validate } from '../utils/validations/validate.js';
import {onlyNameSchem} from '../utils/validations/schemas/onlyNameSchem.js'
import { string } from 'zod';

// Este este enpoint es para desarrollo no esta disponible la 
// opcion de crear roles en el producto final
const createRole = async (req, res) => {
    try {
  
        const validation = await validate(onlyNameSchem, req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validacion',
                details: validation.errors,
            });
        }
        const {name} = validation.data

        const existingRol = prisma.role.findUnique({
            where: { name }
        })

        if (!existingRol) {
            return res.status(404).json({
                success: false,
                error: 'Este rol ya existe'
            });
        }

        const rol = await prisma.role.create({
            data: {
                name,
            }
        });

        res.status(200).json({ message: "Rol creado", rol });
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
            return res.status(404).JSON({
                success: false,
                error: 'Rol ya registrado'
            })
        }

        const updateRole = await prisma.role.update({
            where: { id },
            data: {
                name: searchRole
            },
            include: {
                id: true,
                name: true
            }
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