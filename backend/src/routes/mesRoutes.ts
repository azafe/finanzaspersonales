import { Router } from 'express';
import { getMes, listMeses } from '../controllers/MesController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, listMeses);
router.get('/:year/:month', authMiddleware, getMes);

export default router;
