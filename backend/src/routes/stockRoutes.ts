import express from "express";
import {
  getCompanyProfile,
  getStockQuote,
  searchStocks,
  getCandles,
} from "../controllers/stockController";
import prisma from "../lib/prisma";

const router = express.Router();

// Stock search route
router.get("/search", (req, res, next) => {
  searchStocks(req, res).catch(next);
});

// Company profile route
router.get("/profile/:symbol", (req, res, next) => { 
  getCompanyProfile(req, res).catch(next)
});

// Stock quote route
router.get("/quote/:symbol", (req, res, next) => {
  getStockQuote(req, res).catch(next);
});

// Historical candle data route
router.get("/candles/:symbol", (req, res, next) => {
  getCandles(req, res).catch(next);
});

router.get("/all",async (req, res, next) => {
  const stocks =  await prisma.stock.findMany();
  console.log(stocks);
  res.json({ message: "All stocks" , stocks });
});

export default router;
