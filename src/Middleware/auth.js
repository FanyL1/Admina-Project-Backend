// Middleware de verificacion de autenticación y autorización
import prisma from '../config/prisma.js';
import {verifyToken} from '../utils/token.js';

// Verificar si el usuario está autenticado
export const protect = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'No autorizado - Token no proporcionado' 
            });
        }
        
        const decoded = verifyToken(token);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true } 
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Error en protect:', error);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// Verificar roles específicos
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role?.name || req.user.rol?.name;
        
        if (!roles.includes(userRole)) {
            return res.status(403).json({ 
                error: 'No tienes permiso para acceder a este recurso' 
            });
        }
        
        next();
    };
};
