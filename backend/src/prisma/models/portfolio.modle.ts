import { NumericLiteral } from 'typescript'
import prisma from '../../lib/prisma'
import { createUser } from './user.modle'

export const PortfolioModel = prisma.portfolio

export async function createPortfolio(userId: number, initialValue:number){
    return prisma.portfolio.create({
        data:{
            userId,
            initial_value: initialValue,
            current_value: initialValue,
            stocks:[]
        }
    })
}

export async function getByUserId(userId:number){
    return prisma.portfolio.findUnique({where:{userId}})
}

export async function updateValues(porfolioId: number, invested_value: number, current_value: number){
    return prisma.portfolio.update({
        where:{id: porfolioId},
        data: {invested_value, current_value}
    })
}