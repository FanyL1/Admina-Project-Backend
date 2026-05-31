import { Router } from 'express';
import { restrictTo } from '../Middleware/auth.js';
// Nota: En algunos proyectos con ES Modules nativo en Node, hay que poner la extensión ".js" al final de la ruta. Si te da error de que no encuentra el módulo, ponle '.js' al final.
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categories.controller.js';

const router = Router();

router.get('/', getCategories);
router.post('/', restrictTo('admin'), createCategory);
router.patch('/:id', restrictTo('admin'), updateCategory);
router.delete('/:id', restrictTo('admin'), deleteCategory);

export default router;