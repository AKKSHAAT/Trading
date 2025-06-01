import { Router, RequestHandler } from 'express';
import { handleBuyLimitOrder, handleSellLimitOrder, handlePurchasing, handleSelling, getDepthChartData } from '../controllers/trading';

const router = Router();
// market orders
router.post('/buy', handlePurchasing as RequestHandler); // qty
router.post('/sell', handleSelling as RequestHandler); // qty  

// limit orders
router.post('/buy-lmt', handleBuyLimitOrder as RequestHandler); // limit-price & qty
router.post('/sell-lmt', handleSellLimitOrder as RequestHandler); // limit-price & qty

// depth chart
router.get('/depth-chart', getDepthChartData as RequestHandler);

export default router;