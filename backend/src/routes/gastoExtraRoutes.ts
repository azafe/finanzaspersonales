import { Router } from 'express';
import { createGastoExtra, updateGastoExtra, deleteGastoExtra } from '../controllers/GastoExtraController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createGastoExtra);
router.put('/:id', updateGastoExtra);
router.delete('/:id', deleteGastoExtra);

export default router;
