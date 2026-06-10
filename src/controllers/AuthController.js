import prisma from '../config/prisma.js';
import bcryptjs from 'bcryptjs';
import { createToken, tokenExpirationSeconds } from '../utils/token.js';
import { validate } from '../utils/validations/validate.js';
import { loginSchema, registerSchema } from '../utils/validations/schemas/authSchem.js';

const salt = 10;

const singUp = async (req, res) => {
    try {
        //Validacion de campos con el esquema
        const validation = await validate(registerSchema, req.body);        
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.errors,
            });
        }
        
        
        const { name, lastname, dni, email, pass } = validation.data;
        const hashPAssword = await bcryptjs.hash(pass, salt);
        const defaultRole = await prisma.role.findUnique({
            where: { name: 'Estudiante' }
        });
        const roleId = defaultRole['id'];
        

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                status: true
            }
        });
        
        if (existingUser) {
            return res.status(400).json({
                error: 'El email ya está registrado',
            });
        }
        console.log(email);

        const existingDNI = await prisma.user.findUnique({
            where: { dni }
        });
        
        if (existingDNI) {
            return res.status(400).json({
                error: 'Cedula ya está registrado',
            });
        }
        
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
        return res.status(201).json({ 
          message: "Usuario creado"
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Usuario ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const validation = await validate(loginSchema, req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validacion',
                details: validation.errors,
            });
        }

        const { email, pass } = validation.data;
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!user || user.status !== 'active') {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const isValidPassword = await bcryptjs.compare(pass, user.pass);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const token = createToken({
            id: user.id,
            email: user.email,
            role: user.role?.name,
        });
        const { pass: _password, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: 'Login exitoso',
            token,
            expiresIn: tokenExpirationSeconds,
            user: userWithoutPassword,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    singUp,
    login
};
