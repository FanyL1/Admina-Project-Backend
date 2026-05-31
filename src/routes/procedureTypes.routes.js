import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
import {  getProcedureTypes,  createProcedureType,  updateProcedureType,  deleteProcedureType } from '../controllers/procedureTypes.controller.js';

const router = Router();

router.get('/', getProcedureTypes);
router.post('/', restrictTo('admin'), createProcedureType);
router.patch('/:id', restrictTo('admin'), updateProcedureType);
router.delete('/:id', restrictTo('admin'), deleteProcedureType);

export default router;