import prisma from '../../lib/prisma'

export const UserModel = prisma.user

export async function createUser(username: string, email: string, password: string) {
    return await UserModel.create({
        data: {
            username,
            email,
            password
        }
    })
}

export async function getUserById(id: number) {
    return await UserModel.findUnique({
        where: {
            id
        }
    })
}
 
export async function getAllUsers(){
    return await UserModel.findMany()
}

export async function updateUser(id: number, username: string, email: string, password: string) {
    return await UserModel.update({
        where:{id},
        data:{
            username,
            email,
            password
        }   
    })
}

export async function deleteUser(id: number){
    return await UserModel.delete({
        where:{
            id
        }
    })
}