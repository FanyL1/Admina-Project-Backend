import express from 'express';
import { protect, restrictTo} from "../Middleware/auth.js";
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


//Usuarios
router.get('/profile', userController.getUserById); 
router.patch('/profile/update', userController.updateUser); 

//ESTUDIANTES

//ADMINSTRATIVO
router.use('/categories',restrictTo('Administrativo','Superusuario'), categoriesRoutes);
router.use('/procedure-types',restrictTo('Administrativo','Superusuario'), procedureTypesRoutes);

//SUPERUSUARIOS
//Lista de usuarios
router.get('/users', restrictTo('Superusuario'), userController.getAllUsers); // Solo Superusuario puede ver todos los usuarios activos
router.get('/users/inactive', restrictTo('Superusuario'), userController.getInactiveUsers); // Solo Superusuario puede ver usuarios inactivos
router.patch('/users/delete/:id', restrictTo('Superusuario'), userController.deleteUser); // Solo Superusuario puede eliminar usuarios
router.patch('/users/update/:id', restrictTo('Superusuario'), userController.updateUser); // Solo Superusuario puede actualizar usuarios
router.patch('/users/update/Superusuario/:id', restrictTo('Superusuario'), userController.updateBySuperUser); // Solo Superusuario puede actualizar usuarios incluyendo rol y dni
//Carerras
router.get('/carreras', restrictTo('Superusuario'), carreraController.allDegree );  // Solo Superusuario puede ver
router.post('/carreras', restrictTo('Superusuario'), carreraController.addDegree);  // Solo Superusuario puede crear
router.patch('/carreras/:id', restrictTo('Superusuario'), carreraController.updateDegree);  // Solo Superusuario puede actualizar
export default router;
