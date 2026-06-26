import express from 'express';
import { protect, restrictTo} from "../Middleware/auth.js";
import { getAllUsers, getUserById, updateUser, updateBySuperUser, UpadateRoleUser, UpadateStatuseUser, getStudent } from '../controllers/userController.js';    

const router = express.Router();    

router.get('/', getAllUsers); // Solo Superusuario puede ver todos los usuarios activos
router.get('/studiants', restrictTo('Superusuario', 'Administrativo'), getStudent); // Solo Superusuario y Administrativos pueden ver estudiantes
router.patch('/update/:id', restrictTo('Superusuario','Administrativo', 'Estudiante'), updateUser); // Solo Superusuario puede actualizar usuarios
router.patch('/update/Superusuario/:id', restrictTo('Superusuario'), updateBySuperUser); // Solo Superusuario puede actualizar usuarios incluyendo rol y dni
router.patch('/role/:id', restrictTo('Superusuario'), UpadateRoleUser); // Solo Superusuario puede cambiar roles
router.patch('/status/:id', restrictTo('Administrativo','Superusuario'), UpadateStatuseUser); // Solo Superusuario puede eliminar usuarios

export default router;