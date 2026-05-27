import express from 'express';
import { protect, restrictTo, adminOnly } from "../Middleware/auth.js";
import AuthController from '../controllers/authController.js';
import roleController from '../controllers/roleController.js';
import carreraController from '../controllers/degreeController.js';
import userController from '../controllers/userController.js';
const router = express.Router();

//Rutas Publicas (no utilizan protect)
router.get('/', (req, res) => { res.json({ message: 'API funcionando'})});
router.post('/signup', AuthController.singUp);
router.post('/login', AuthController.login);
router.post('/role', roleController.createRole);

//rutas Privadas (utilizan protect)
router.use(protect);

//REGULAR
//Usuarios
router.get('/profile', protect, userController.getUserById); // Cualquier usuario autenticado puede ver su perfil
router.patch('/profile/update', protect, userController.updateUser); // Cualquier usuario autenticado puede actualizar su perfil

//ADMINSTRATIVO

//ADMIN
//Lista de usuarios
router.get('/users', restrictTo('admin'), userController.getAllUsers); // Solo admin puede ver todos los usuarios activos
router.get('/users/inactive', restrictTo('admin'), userController.getInactiveUsers); // Solo admin puede ver usuarios inactivos
router.patch('/users/delete/:id', restrictTo('admin'), userController.deleteUser); // Solo admin puede eliminar usuarios
router.patch('/users/update/:id', restrictTo('admin'), userController.updateUser); // Solo admin puede actualizar usuarios
router.patch('/users/update/admin/:id', restrictTo('admin'), userController.updateUserByAdmin); // Solo admin puede actualizar usuarios incluyendo rol y dni
//Carerras
router.get('/carreras', restrictTo('admin'), carreraController.allDegree );  // Solo admin puede ver
router.post('/carreras', restrictTo('admin'), carreraController.addDegree);  // Solo admin puede crear
router.patch('/carreras/:id', restrictTo('admin'), carreraController.updateDegree);  // Solo admin puede actualizar
export default router;
