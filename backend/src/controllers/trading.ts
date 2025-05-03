import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

interface TradingRequest extends Request {
    body: {
        userId: string;
        symbol: string;
        quantity: number;
        orderType: 'buy' | 'sell';
    }
}

export const handlePurchasing = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    const {userId, symbol, quantity, orderType} = req.body;
    const currValue = 200;
    const user = await prisma.user.findUnique({
        where:{id: userId},
        include:{portfolio: true}
    })
    if(!user){
        return res.status(404).json({error:"user not found"})
    }
    try {
        if(orderType == "buy"){
            const totalValue = currValue * quantity;
            const stock = await prisma.stock.findUnique({where:{symbol: symbol}})
            if(!stock){
                return res.status(404).json({error: "stock not found"})
            }
    
            const portfolio = user.portfolio
            if(user.balance >= totalValue){ 
                const entry = await prisma.portfolioEntry.findUnique({
                    where: {
                        portfolioId_stockId: {
                            portfolioId: portfolio?.id || "",
                            stockId: stock.id
                        }
                    }
                })
                if(!entry && portfolio?.id){
                    const deal = await prisma.portfolioEntry.create({
                        data:{
                            portfolioId: portfolio?.id,
                            stockId: stock.id,
                            quantity: quantity,
                            avgBuyPrice: totalValue
                        }
                    })
                    if(deal){
                        return res.status(201).json({message: "purchasing done"})
                    }
                }else{
                    const deal = await prisma.portfolioEntry.update({
                        where:{id: entry?.id},
                        data:{
                            quantity: quantity,
                            avgBuyPrice: totalValue
                        }
                    })
                    if(deal){
                        return res.status(201).json({message: "purchasing done"})
                    }
                }
            }else{
                return res.status(404).json({error:"insufficient balance"})
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"something went wrong while purchasing", err:error})
    }   
}

export const handleSelling = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    const {userId, symbol, quantity, orderType} = req.body;
    const currValue = 200;
    const user = await prisma.user.findUnique({
        where:{id: userId},
        include:{portfolio: true}
    })
    try {
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        if(orderType == "sell"){
            const sellAmount = currValue * quantity;
            const stock = await prisma.stock.findUnique({where:{symbol:symbol}})
            if(!stock){
                return res.status(404).json({error:"stock not found"})
            }

            const portfolio = user.portfolio;
            if(portfolio?.id){
                const entry = await prisma.portfolioEntry.findUnique({
                    where:{
                        portfolioId_stockId:{
                            portfolioId: portfolio?.id,
                            stockId: stock.id
                        }
                    }
                })
                if(entry && entry?.quantity >= quantity){
                    const newQuantity = entry.quantity - quantity
                    const updatedAmt = user.balance + sellAmount;
    
                    if(newQuantity === 0){
                        await prisma.portfolioEntry.delete({
                            where:{id:entry.id}
                        })
                    }
                    const deal = await prisma.portfolioEntry.update({
                        where:{
                            id:entry.id
                        },
                        data:{
                            quantity: newQuantity,
                            avgBuyPrice: updatedAmt
                        }
                    })
                    if(deal){
                        return res.status(201).json({message:"selling successfull", updatedAmt})
                    }
                }else{
                    return res.status(404).json({error:"insufficient quantity", entry})
                }
            }else{
                return res.send("not portfolio")
            }
        }
    } catch (error) {
        return res.status(500).json({message:"something went wrong while selling", err: error})
    }
}