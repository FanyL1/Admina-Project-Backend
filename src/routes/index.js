import express from 'express';
import { protect, restrictTo} from "../Middleware/auth.js";
import AuthController from '../controllers/authController.js';
import roleController from '../controllers/roleController.js';
import carreraController from '../controllers/degreeController.js';
import {getAuditLogs} from '../controllers/auditController.js'
import userRouter from './user.routes.js';
import categoriesRoutes from './categories.routes.js';
import procedureTypesRoutes from './procedureTypes.routes.js';
import requestRoutes from './request.routes.js';
import { getUserById, updateUser} from '../controllers/userController.js';
const router = express.Router();

//Rutas Publicas (no utilizan protect)
router.get('/', (req, res) => { res.json({ message: 'API funcionando'})});
router.post('/signup', AuthController.singUp);
router.post('/login', AuthController.login);


//rutas Privadas (utilizan protect)
router.use(protect);

router.get('/profile', getUserById);
router.patch('/profile/update', updateUser); 

router.use('/requests', restrictTo('Estudiante','Administrativo','Superusuario'), requestRoutes); // Rutas solicutudes para estudiantes
router.use('/categories',restrictTo('Estudiante','Administrativo','Superusuario'), categoriesRoutes);

router.use('/procedure-types',restrictTo('Estudiante','Administrativo','Superusuario'), procedureTypesRoutes);

router.use('/users', userRouter);

//Rol
router.post('/role', restrictTo('Superusuario'), roleController.createRole);
router.get('/role',restrictTo('Superusuario'), roleController.getAllRoles);
router.patch('/role/:id',restrictTo('Superusuario'), roleController.UpdateRole);
router.get('/audit-logs', restrictTo('Administrativo','Superusuario'),getAuditLogs);

//Carerras
router.get('/degree', restrictTo('Estudiante','Administrativo','Superusuario'), carreraController.allDegree );  
router.post('/degree', restrictTo('Superusuario'), carreraController.addDegree); 
router.patch('/degree/:id', restrictTo('Superusuario'), carreraController.updateDegree);
router.patch('/degree/status/:id',restrictTo('Superusuario'), carreraController.updateStatusDegree)

export default router;