import prisma from '../config/prisma.js';
import bcryptjs from 'bcryptjs';
import { validate } from '../utils/validations/validate.js';
import {registerSchema} from '../utils/validations/schemas/mainSchem.js'
import { string } from 'zod';

const salt = 10;

const createUser = async (req, res) => {
    try {
        //Validacion de campos con el esquema
        const validation = await validate(registerSchema, req.body);        
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.errors,
            });
        }
        
        const { name, lastname ,dni, email, pass } = validation.data;  
        
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        const existingDNI = await prisma.user.findUnique({
            where: { dni },
        });
        
        if (existingUser) {
            return res.status(400).json({
                error: 'El email ya está registrado',
            });
        }
        if (existingDNI) {
            return res.status(400).json({
                error: 'Cedula ya está registrado',
            });
        }

        const defaultRole = await prisma.role.findUnique({
            where: { name: 'Estudiante' }
        });
        const roleId = defaultRole['id'];
        const hashPAssword = await bcryptjs.hash(pass, salt);
        const user = await prisma.user.create({
            data: {
                name,
                lastname,
                dni,
                email,
                pass: hashPAssword,
                rol_id: roleId
            }
        });
        res.status(201).json({ message: "Usuario creado", user });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
};

export default {
    createUser
};