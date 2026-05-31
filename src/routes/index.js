import express from 'express';
import { protect, restrictTo } from "../Middleware/auth.js";
import AuthController from '../controllers/authController.js';
import roleController from '../controllers/roleController.js';
import carreraController from '../controllers/degreeController.js';
import userController from '../controllers/userController.js';
import categoriesRoutes from './categories.routes.js';
import procedureTypesRoutes from './procedureTypes.routes.js';

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
router.get('/profile', userController.getUserById); 
router.patch('/profile/update', userController.updateUser); 

//ADMINSTRATIVO
router.use('/categories', categoriesRoutes);
router.use('/procedure-types', procedureTypesRoutes);

//ADMIN
//Lista de usuarios
router.get('/users', restrictTo('admin'), userController.getAllUsers); 
router.get('/users/inactive', restrictTo('admin'), userController.getInactiveUsers); 
router.patch('/users/delete/:id', restrictTo('admin'), userController.deleteUser); 
router.patch('/users/update/:id', restrictTo('admin'), userController.updateUser); 
router.patch('/users/update/admin/:id', restrictTo('admin'), userController.updateUserByAdmin); 
//Carerras
router.get('/carreras', restrictTo('admin'), carreraController.allDegree );  
router.post('/carreras', restrictTo('admin'), carreraController.addDegree);  
router.patch('/carreras/:id', restrictTo('admin'), carreraController.updateDegree);  

export default router;