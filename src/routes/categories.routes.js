import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
import {   getCategories,  createCategory,  updateCategory, updateStatusCategory } from '../controllers/categories.controller.js';

const router = Router();

router.get('/', restrictTo('Estudiante','Administrativo','Superusuario'), getCategories);
router.post('/',restrictTo('Administrativo','Superusuario'), createCategory);
router.patch('/:id',restrictTo('Administrativo','Superusuario'), updateCategory);
router.patch('/status/:id', restrictTo('Administrativo','Superusuario'),updateStatusCategory)

export default router;