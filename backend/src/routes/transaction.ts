import { Router, RequestHandler } from 'express';
import { handlePurchasing, handleSelling } from '../controllers/trading';

const router = Router();

router.post('/buy', handlePurchasing as RequestHandler);
router.post('/sell', handleSelling as RequestHandler);

export default router;