import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
import {   getCategories,  createCategory,  updateCategory,  deleteCategory } from '../controllers/categories.controller.js';

const router = Router();

router.get('/', getCategories);
router.post('/', restrictTo('admin'), createCategory);
router.patch('/:id', restrictTo('admin'), updateCategory);
router.delete('/:id', restrictTo('admin'), deleteCategory);

export default router;