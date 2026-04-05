import { Router } from 'express';
import { listTarjetas, createTarjeta, updateTarjeta, deleteTarjeta } from '../controllers/TarjetaController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', listTarjetas);
router.post('/', createTarjeta);
router.put('/:id', updateTarjeta);
router.delete('/:id', deleteTarjeta);

export default router;
