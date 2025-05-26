import { Router, RequestHandler } from 'express';
import { handlePurchasing, handleSelling } from '../controllers/trading';

const router = Router();
// market orders
router.post('/buy', handlePurchasing as RequestHandler); // qty
router.post('/sell', handleSelling as RequestHandler); // qty  

// limit orders
router.post('/buy-lmt', handlePurchasing as RequestHandler); // limit-price & qty
// setp 1 push to orders array 
// step 2 setup cron job to check orders array every 5 seconds
// step 3 if current price is less than limit-price then execute order
// 3.5 handlePurchasing
// step 4 remove order from orders array

export default router;