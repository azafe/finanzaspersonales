import { Router } from 'express';
import { createGastoFijo, updateGastoFijo, deleteGastoFijo, togglePaid } from '../controllers/GastoFijoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createGastoFijo);
router.put('/:id', updateGastoFijo);
router.delete('/:id', deleteGastoFijo);
router.patch('/:id/toggle-paid', togglePaid);

export default router;
