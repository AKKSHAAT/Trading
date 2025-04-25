import prisma from "../../lib/prisma";

export async function createStock(portfolioId:number, stock_id: string, symbol:String, qty:number, name:String){
    return await prisma.stock.create({
        data:{
            portfolioId,
            stock_id,
            symbol,
            qty,
            name
        }
    })
}

export async function getStockById(id: number){
    return await prisma.stock.findUnique({
        where:{id}
    })
}

export async function getAllStocksByPortfolio(portfolioId:number){
    return await prisma.stock.findMany({
        where:{portfolioId}
    })
}

export async function updateStock(id:number, stock_id:number, symbol:String, qty:number, name:String){
    return await prisma.stock.update({
        where: {id},
        data:{
            stock_id,
            symbol,
            qty,
            name
        }
    })
}