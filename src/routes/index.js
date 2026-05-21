import express from 'express';
//import userRouter from './userRoutes.js';
import signUpController from '../controllers/singUpController.js';
import roleController from '../controllers/roleController.js';
const router = express.Router();

//Rutas Publicas
router.post('/signup',signUpController.createUser);
router.post('/role',roleController.createRole)
//rutas Privadas
//router.use('/users', userRouter);

export default router;