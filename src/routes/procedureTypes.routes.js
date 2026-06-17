import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
import {  getProcedureTypes,  createProcedureType,  updateProcedureType, updateStatusProcedureType } from '../controllers/procedureTypes.controller.js';

const router = Router();

router.get('/',restrictTo('Estudiante','Administrativo','Superusuario'), getProcedureTypes);
router.post('/', restrictTo('Administrativo','Superusuario'), createProcedureType);
router.patch('/:id', restrictTo('Administrativo','Superusuario'), updateProcedureType);
router.patch('/status/:id', restrictTo('Administrativo','Superusuario'),updateStatusProcedureType)

export default router;