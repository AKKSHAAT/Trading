import express from 'express';
import { 
  getCompanyProfile, 
  getStockQuote, 
  searchStocks, 
  getCandles 
} from '../controllers/stockController';

const router = express.Router();

// Stock search route
router.get('/search', searchStocks);

// Company profile route
router.get('/profile/:symbol', getCompanyProfile);

// Stock quote route
router.get('/quote/:symbol', getStockQuote);

// Historical candle data route
router.get('/candles/:symbol', getCandles);

export default router;
