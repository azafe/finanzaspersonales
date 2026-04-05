import { Router } from 'express';
import { createIngreso, updateIngreso, deleteIngreso } from '../controllers/IngresoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createIngreso);
router.put('/:id', updateIngreso);
router.delete('/:id', deleteIngreso);

export default router;
