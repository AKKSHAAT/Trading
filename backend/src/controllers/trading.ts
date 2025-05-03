import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { updateEmailOrPassword } from "supertokens-node/recipe/emailpassword";

interface TradingRequest extends Request {
    body: {
        userId: string;
        symbol: string;
        quantity: number;
        orderType: 'buy' | 'sell';
    }
}

// Purchasing logic
export const handlePurchasing = async (
    req: TradingRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { userId, symbol, quantity, orderType } = req.body;
    const currValue = 200; // This should be replaced by real-time price fetching logic
  
    try {
      // 1. Find user and their portfolio
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { portfolio: true },
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (orderType !== "buy") {
        return res.status(400).json({ error: "Invalid order type" });
      }
  
      const totalCost = currValue * quantity;
  
      // 2. Check if user has enough balance
      if (user.balance < totalCost) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
  
      // 3. Check if stock exists
      const stock = await prisma.stock.findUnique({
        where: { symbol },
      });
  
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
  
      const portfolio = user.portfolio;
      if (!portfolio?.id) {
        return res.status(404).json({ error: "User has no portfolio" });
      }
  
      // 4. Check if user already owns this stock
      const existingEntry = await prisma.portfolioEntry.findUnique({
        where: {
          portfolioId_stockId: {
            portfolioId: portfolio.id,
            stockId: stock.id,
          },
        },
      });
  
      // 5. Deduct user's balance first
      const updatedBalance = user.balance - totalCost;
  
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: updatedBalance,
        },
      });
  
      if (!existingEntry) {
        // First time buying this stock — create new portfolio entry
        await prisma.portfolioEntry.create({
          data: {
            portfolioId: portfolio.id,
            stockId: stock.id,
            quantity,
            avgBuyPrice: currValue, // price per stock
          },
        });
      } else {
        // Already owns it — update quantity and calculate new avgBuyPrice
        const totalQuantity = existingEntry.quantity + quantity;
        const totalSpent =
          existingEntry.avgBuyPrice * existingEntry.quantity + currValue * quantity;
        const newAvgPrice = totalSpent / totalQuantity;
  
        await prisma.portfolioEntry.update({
          where: { id: existingEntry.id },
          data: {
            quantity: totalQuantity,
            avgBuyPrice: newAvgPrice,
          },
        });
      }
  
      return res.status(201).json({
        message: "Stock purchased successfully",
        newBalance: updatedBalance,
      });
  
    } catch (error) {
      console.error("Purchase error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong while purchasing", error });
    }
};
  


//Selling Logic
export const handleSelling = async (
    req: TradingRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { userId, symbol, quantity, orderType } = req.body;
    const currValue = 200; // Assume fixed price or replace with real-time price logic
  
    try {
      // 1. Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { portfolio: true },
      });
  
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
  
      // 2. Check if stock exists
      const stock = await prisma.stock.findUnique({
        where: { symbol },
      });
  
      if (!stock) {
        return res.status(404).json({ error: "stock not found" });
      }
  
      const portfolio = user.portfolio;
  
      // 3. Check if user has this stock in portfolio and enough quantity
      if (!portfolio?.id) {
        return res.status(404).json({ error: "user has no portfolio" });
      }
  
      const entry = await prisma.portfolioEntry.findUnique({
        where: {
          portfolioId_stockId: {
            portfolioId: portfolio.id,
            stockId: stock.id,
          },
        },
      });
  
      if (!entry || entry.quantity < quantity) {
        return res.status(400).json({ error: "Insufficient quantity", entry });
      }
  
      // 4. Proceed with selling
      const newQuantity = entry.quantity - quantity;
      const sellAmount = currValue * quantity;
      const newBalance = user.balance + sellAmount;
  
      // If all stock is sold, remove the entry
      if (newQuantity === 0) {
        await prisma.portfolioEntry.delete({
          where: { id: entry.id },
        });
      } else {
        // Otherwise, update the quantity
        await prisma.portfolioEntry.update({
          where: { id: entry.id },
          data: {
            quantity: newQuantity,
            avgBuyPrice: entry.avgBuyPrice, // Keep avgBuyPrice unchanged on sell
          },
        });
      }
  
      // 5. Update user balance
      await prisma.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });
  
      return res
        .status(201)
        .json({ message: "Selling successful", updatedBalance: newBalance });
  
    } catch (error) {
      console.error("Sell error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong while selling", error });
    }
};  