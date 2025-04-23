import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();

export async function createUser(username: string, email: string, password: string) {
    return await prisma.user.create({
        data: {
            username,
            email,
            password
        }
    })
}

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}

export async function getAllUsers(){
    return await prisma.user.findMany()
}

export async function updateUser(id: number, username: string, email: string, password: string) {
    return await prisma.user.update({
        where:{id},
        data:{
            username,
            email,
            password
        }   
    })
}

export async function deleteUser(id: number){
    return await prisma.user.delete({
        where:{
            id
        }
    })
}