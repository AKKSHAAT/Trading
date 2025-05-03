import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

interface TradingRequest extends Request {
    body: {
        userId: string;
        symbol: string;
        quantity: number;
    }
}

export const handlePurchasing = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    const {userId, symbol, quantity} = req.body;
    const currValue = 200;
    
    const user = await prisma.user.findUnique({
        where:{id: userId},
        include:{portfolio: true}
    })
    if(!user){
        return res.status(404).json({error:"user not found"})
    }
    try {
        const transactionValue = currValue * quantity;
        const stock = await prisma.stock.findUnique({where:{symbol: symbol}})
        if(!stock){
            return res.status(404).json({error: "stock not found"})
        }

        const portfolio = user.portfolio
        if(user.balance >= transactionValue){  // has money to buy
            const portfolioEntry = await prisma.portfolioEntry.findUnique({ // check if the user aledy owns the stock
                where: {
                    portfolioId_stockId: {
                        portfolioId: portfolio?.id || "",
                        stockId: stock.id
                    }
                }
            })
            if(!portfolioEntry && portfolio?.id){ // if the user does not own the stock, create a new entry
                const stockBought = await prisma.portfolioEntry.create({
                    data:{
                        portfolioId: portfolio?.id,
                        stockId: stock.id,
                        quantity: quantity,
                        avgBuyPrice: transactionValue
                    }
                })
                const newBalance = await prisma.user.update({
                    where:{id: userId},
                    data:{
                        balance: user.balance - transactionValue
                    }
                })
                if(stockBought){
                    return res.status(201).json({message: "Transaction successful", stockBought, newBalance})
                }
            }else{ // if the user already owns the stock, update the entry
                const stockBought = await prisma.portfolioEntry.update({
                    where:{id: portfolioEntry?.id},
                    data:{
                        quantity: quantity,
                        avgBuyPrice: transactionValue
                    }
                })
                const newBalance = await prisma.user.update({
                    where:{id: userId},
                    data:{
                        balance: user.balance - transactionValue
                    }
                })
                if(stockBought){
                    return res.status(201).json({message: "purchasing done", newBalance})
                }
            }
        }else{
            return res.status(400).json({error:"insufficient balance"})
        
        }
    } catch (error) {
        console.log("Err: 🤚", error)
        return res.status(500).json({message:"something went wrong while purchasing", err:error})
    }   
}

export const handleSelling = async (req: TradingRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    const {userId, symbol, quantity} = req.body;
    const currValue = 230;

    const user = await prisma.user.findUnique({
                    where:{id: userId},
                    include:{portfolio: true}
                })
    if(!user){
        return res.status(404).json({error:"user not found"})
    }
    try {
        const transactionValue = currValue * quantity;
        const stock = await prisma.stock.findUnique({where:{symbol:symbol}})
        if(!stock){
            return res.status(404).json({error:"stock not found"})
        }

        const portfolio = user.portfolio;
        if(portfolio?.id){
            const portfolioEntry = await prisma.portfolioEntry.findUnique({
                where:{
                    portfolioId_stockId:{
                        portfolioId: portfolio?.id,
                        stockId: stock.id
                    }
                }
            })
            if (!portfolioEntry) return res.status(404).json({error:"stock not in portfolio"})
                
            if(portfolioEntry?.quantity >= quantity){
                const newQuantity = portfolioEntry.quantity - quantity
                const updatedAmt = user.balance + transactionValue;

                if(newQuantity === 0){
                    const transaction = await prisma.portfolioEntry.delete({
                        where:{id:portfolioEntry.id}
                    })

                    const newBalance = await prisma.user.update({
                        where:{id: userId},
                        data:{
                            balance: updatedAmt
                        }
                    })
                    if(transaction){
                        return res.status(201).json({message:"selling successfull", newBalance, transaction})
                    }
                }
                const transaction = await prisma.portfolioEntry.update({
                    where:{
                        id:portfolioEntry.id
                    },
                    data:{
                        quantity: newQuantity,
                    }
                })
                const newBalance = await prisma.user.update({
                    where:{id: userId},
                    data:{
                        balance: updatedAmt
                    }
                })
                if(transaction){
                    return res.status(201).json({message:"selling successfull", newBalance, transaction})
                }
            }else{
                return res.status(404).json({error:"insufficient quantity", portfolioEntry})
            }
        }else{
            return res.send("no portfolio")
        }
    } catch (error) {
        return res.status(500).json({message:"something went wrong while selling", err: error})
    }
}

