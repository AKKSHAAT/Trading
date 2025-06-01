import { Request, Response, NextFunction } from "express";
import axios from "axios";
import prisma from "../lib/prisma";

interface OrderData {
    userId: string;
    symbol: string;
    quantity: number;
    price: number
}

interface TradingRequest extends Request {
    body: OrderData
}

const buyOrders: OrderData[] = [];
const sellOrders: OrderData[] = [];

export const executeBuyOrder = async ({userId, symbol, quantity, price}: OrderData) => {

  const transactionValue = quantity * price;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { portfolio: true }
  });
  if (!user) throw new Error("User not found");

  if (user.balance < transactionValue) throw new Error("Insufficient balance");

  const stock = await prisma.stock.findUnique({ where: { symbol } });
  if (!stock) throw new Error("Stock not found");

  const portfolio = user.portfolio;
  const existingEntry = await prisma.portfolioEntry.findUnique({
    where: {
      portfolioId_stockId: {
        portfolioId: portfolio?.id || "",
        stockId: stock.id
      }
    }
  });

  if (!existingEntry && portfolio?.id) {
    await prisma.portfolioEntry.create({
      data: {
            portfolioId: portfolio.id,
            stockId: stock.id,
            quantity,
            avgBuyPrice: transactionValue
        }
    });
  } else if (existingEntry) {
    await prisma.portfolioEntry.update({
      where: { id: existingEntry.id },
      data: {
        quantity: existingEntry.quantity + quantity,
        avgBuyPrice:
          (existingEntry.avgBuyPrice * existingEntry.quantity + transactionValue) /
          (existingEntry.quantity + quantity)
      }
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { balance: user.balance - transactionValue }
  });

  return {
    message: "Buy successful",
    stock: symbol,
    quantity,
    price,
    balance: updatedUser.balance
  };
};

export const executeSellOrder = async ({ userId, symbol, quantity, price }: OrderData) => {
    const transactionValue = price * quantity;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { portfolio: true }
    });
    if (!user) throw new Error("User not found");

    const stock = await prisma.stock.findUnique({ where: { symbol } });
    if (!stock) throw new Error("Stock not found");

    const portfolio = user.portfolio;
    if (!portfolio?.id) throw new Error("User has no portfolio");

    const portfolioEntry = await prisma.portfolioEntry.findUnique({
        where: {
            portfolioId_stockId: {
                portfolioId: portfolio.id,
                stockId: stock.id
            }
        }
    });
    if (!portfolioEntry) throw new Error("Stock not in portfolio");

    if (portfolioEntry.quantity < quantity) {
        throw new Error("Insufficient quantity in portfolio");
    }

    const newQuantity = portfolioEntry.quantity - quantity;
    const updatedBalance = user.balance + transactionValue;

    if (newQuantity === 0) {
        // Delete entry if all stock sold
        await prisma.portfolioEntry.delete({
            where: { id: portfolioEntry.id }
        });
    } else {
        // Update entry if partial sale
        await prisma.portfolioEntry.update({
            where: { id: portfolioEntry.id },
            data: { quantity: newQuantity }
        });
    }

    // Update balance
    const newBalance = await prisma.user.update({
        where: { id: userId },
        data: { balance: updatedBalance }
    });

    return {
        message: "Sell order executed successfully",
        newBalance,
        sold: {
            symbol,
            quantity,
            price
        }
    };
};

export const handlePurchasing = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    const {userId, symbol, quantity} = req.body;
    const price = 200;
    try {
        const ressult = await executeBuyOrder({userId, symbol, quantity, price})
        return res.status(201).json(ressult)
    } catch (error) {
        console.log("Err: 🤚", error)
        return res.status(500).json({message:"something went wrong while purchasing", err:error})
    }   
}


export const handleSelling = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    const {userId, symbol, quantity} = req.body;
    const price = 230;
    try {
        const result = await executeSellOrder({userId, symbol, quantity, price})
        return res.status(201).json(result)
    }catch (error) {
        return res.status(500).json({message:"something went wrong while selling", err: error})
    }
}


const findMatchingSellingOrder = (order: any) => {
    return sellOrders.find(sell=>
        sell.symbol === order.symbol &&
        sell.price <= order.price &&
        sell.quantity >= order.quantity &&
        sell.userId !== order.userId,
    )
}

function findMatchingBuyOrder(order: any) {
    return buyOrders.find(buy =>
        buy.symbol === order.symbol &&
        buy.price >= order.price &&
        buy.quantity > 0 &&
        buy.userId !== order.userId
    ) || null;
}


export const handleBuyLimitOrder = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response>=>{
    const {userId, symbol, quantity, price} = req.body;
    const orderData: OrderData = {
        userId,
        symbol,
        quantity,
        price,
    };
    
    buyOrders.push(orderData);
    console.log("Buy order\n",buyOrders)
    buyOrders.map(async(order, idx)=>{
        const matched = findMatchingSellingOrder(order)
        if(matched){
            console.log("Buy match found\n",matched);
            try {
                const result = await executeBuyOrder({
                    userId, symbol, quantity, price
                })
            } catch (error) {
                console.log("Buy limit error",error)
            }
        }
    })
    return res.status(201).json({msg: "order stored"})
}


export const handleSellLimitOrder = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response>=>{
    const {userId, symbol, quantity, price} = req.body;
    const orderData: OrderData = {
        userId,
        symbol,
        quantity,
        price,
    };
    
    sellOrders.push(orderData);
    console.log("Sell order\n",sellOrders)
    sellOrders.map(async(order, idx)=>{
        const matched = findMatchingBuyOrder(order)
        if(matched){
            console.log("sell match found\n",matched);
            try {
                const result = await executeSellOrder({
                    userId, symbol, quantity, price
                })
            } catch (error) {
                console.log("error in sell limit", error)
            }
        }
    })
    return res.status(201).json({msg: "orderd stored"})
}

export const getDepthChartData = async (req: Request, res: Response): Promise<void | Response> => {
    // const { symbol } = req.params;
    
    try {
        // Get raw orders for the symbol
        // const symbolBuyOrders = buyOrders.filter(order => order.symbol === symbol);
        // const symbolSellOrders = sellOrders.filter(order => order.symbol === symbol);

        // Group buy orders by price and sum quantities
        // const buyOrdersDepth = symbolBuyOrders.reduce((acc, order) => {
        //     acc[order.price] = (acc[order.price] || 0) + order.quantity;
        //     return acc;
        // }, {} as Record<number, number>);

        // Group sell orders by price and sum quantities
        // const sellOrdersDepth = symbolSellOrders.reduce((acc, order) => {
        //     acc[order.price] = (acc[order.price] || 0) + order.quantity;
        //     return acc;
        // }, {} as Record<number, number>);

        // Convert to arrays and sort
        const buyDepth = buyOrders
            .sort((a, b) => b.price - a.price); // Sort by price descending
            // .map(([price, quantity]) => ({ price, quantity }))

        const sellDepth = sellOrders
            .sort((a, b) => a.price - b.price); // Sort by price ascending
            // .map(([price, quantity]) => ({ price, quantity }))

        return res.status(200).json({
            buyDepth,
            sellDepth,
            // rawOrders: {
            //     buyOrders: symbolBuyOrders,
            //     sellOrders: symbolSellOrders
            // }
        });
    } catch (error) {
        console.error('Error getting depth chart data:', error);
        return res.status(500).json({ error: 'Failed to get depth chart data' });
    }
};