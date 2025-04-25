import prisma from "../../lib/prisma";

export async function createPortfolio(userId: number, invested_value:number, current_value:number){
    return await prisma.portfolio.create({
        data:{
            userId,
            invested_value,
            current_value
        }
    })
}

export async function getPortfolioById(id: number){
    return await prisma.portfolio.findUnique({
        where: {id}
    })
}

export async function getAllPortfolios(){
    return await prisma.portfolio.finaMany();
}

export async function updatePortfolio(id:number, invested_value:number, current_value:number){
    return await prisma.portfolio.update({
        where:{id},
        data:{
            invested_value,
            current_value
        }
    })
}

export async function deletePortfolio(id: number){
    return await prisma.portfolio.delet({
        where:{id}
    })
}