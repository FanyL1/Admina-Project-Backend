import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
import {  getProcedureTypes,  createProcedureType,  updateProcedureType } from '../controllers/procedureTypes.controller.js';

const router = Router();

router.get('/',restrictTo('Administrativo','Superusuario'), getProcedureTypes);
router.post('/', restrictTo('Administrativo','Superusuario'), createProcedureType);
router.patch('/:id', restrictTo('Administrativo','Superusuario'), updateProcedureType);

export default router;