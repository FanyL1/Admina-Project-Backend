import express from 'express';
import { protect, restrictTo} from "../Middleware/auth.js";
import AuthController from '../controllers/authController.js';
import roleController from '../controllers/roleController.js';
import carreraController from '../controllers/degreeController.js';
import userRouter from './user.routes.js';
import categoriesRoutes from './categories.routes.js';
import procedureTypesRoutes from './procedureTypes.routes.js';
import requestRoutes from './request.routes.js';
import { getUserById, updateUser} from '../controllers/userController.js';

import {getRequests, getOneRequest, getRequestsByUser, createRequest, getAdminRequests, updateRequestStatus} from '../controllers/Request.Controller.js';
import {getDocumentsByRequest, uploadDocuments, updateDocumentFile, addDocumentToRequest} from '../controllers/documents.Controller.js';
import { uploadMultipleFiles, uploadSingleFile, handleMulterError } from '../Middleware/upload.js';

const router = express.Router();

//Rutas Publicas (no utilizan protect)
router.get('/', (req, res) => { res.json({ message: 'API funcionando'})});
router.post('/signup', AuthController.singUp);
router.post('/login', AuthController.login);

//rutas Privadas (utilizan protect)
router.use(protect);

router.get('/profile', getUserById);
router.patch('/profile/update', updateUser); 

router.use('/requests', restrictTo('Estudiante','Superusuario'), requestRoutes); // Rutas solicutudes para estudiantes

router.use('/categories',restrictTo('Administrativo','Superusuario'), categoriesRoutes);

router.use('/procedure-types',restrictTo('Administrativo','Superusuario'), procedureTypesRoutes);

router.use('/users', userRouter);

//Rol
router.post('/role', restrictTo('Superusuario'), roleController.createRole);
router.get('/role',restrictTo('Superusuario'), roleController.getAllRoles);
router.patch('/role/:id',restrictTo('Superusuario'), roleController.UpdateRole);

//Carerras
router.get('/degree', restrictTo('Superusuario'), carreraController.allDegree );  
router.post('/degree', restrictTo('Superusuario'), carreraController.addDegree); 
router.patch('/degree/:id', restrictTo('Superusuario'), carreraController.updateDegree);

export default router;