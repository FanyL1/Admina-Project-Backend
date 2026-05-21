import prisma from '../config/prisma.js';
import bcryptjs from 'bcryptjs';
import { validate } from '../utils/validations/validate.js';
import {registerSchema} from '../utils/validations/schemas/mainSchem.js'
import { string } from 'zod';

// Este este enpoint es para desarrollo no esta disponible la 
// opcion de crear roles en el producto final
const createRole = async (req, res) => {
    try {

        const {name} = req.body;        
        const user = await prisma.role.create({
            data: {
                name,
            }
        });

        res.status(201).json({ message: "Rol creado", user });
    } catch (error) {
        
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Rol ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
};


export default {
    createRole
};