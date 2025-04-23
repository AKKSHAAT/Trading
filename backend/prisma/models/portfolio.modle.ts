import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createPorfolio(userId: number){
    return await prisma.portfolio.create({
        data: {userId}
    })
}

export async function getPortfolioByUserId(userId: number){
    return await prisma.portfolio.findUnique({
        where:{
            userId
        }
    });
}

export async function updatePortfolio(userId: number, invested_value: number, current_value: number) { 
    return await prisma.portfolio.update({
        where:{userId},
        data:{
            invested_value,
            current_value
        }
    })
}

export async function deletePortfolio(userId: number){
    return await prisma.portfolio.delete({
        where:{userId} 
    })
}