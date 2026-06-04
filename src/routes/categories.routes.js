import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
import {   getCategories,  createCategory,  updateCategory } from '../controllers/categories.controller.js';

const router = Router();

router.get('/', restrictTo('Administrativo','Superusuario'), getCategories);
router.post('/',restrictTo('Administrativo','Superusuario'), createCategory);
router.patch('/:id',restrictTo('Administrativo','Superusuario'), updateCategory);

export default router;