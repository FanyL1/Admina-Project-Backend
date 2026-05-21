import express from 'express';
//import userRouter from './userRoutes.js';
import AuthController from '../controllers/AuthController.js';
import roleController from '../controllers/roleController.js';
const router = express.Router();

//Rutas Publicas
router.post('/signup', AuthController.singUp);
router.post('/role', roleController.createRole);
//router.use('/login', AuthController.login);

//rutas Privadas


export default router;