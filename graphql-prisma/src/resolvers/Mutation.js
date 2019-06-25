import  bcrypt from 'bcryptjs'
import prisma from '../prisma'
import { assign } from 'apollo-utilities';

//68 take in pw, validate pw length, hash pw, generate auth token
const Mutation = {
    async createUser(parent, args, { primsa }, info){
        if (args.data.password.length < 8){
            throw new Error ('Password must be 8 characters or longer.')
        }
        //take in plain text pw, return a hashed version
        //take in the user pw from args.data and specify a salt(a number of random numbers to include in hashing)
        const password = await bcrypt.hash(args.data.password, 10)
        //     const emailTaken = await prisma.exists.User({ email: args.data.email }, info)
//     if (emailTaken){
//     throw new Error('Email taken')
// }
return prisma.mutation.createUser({
    //68 modified the data parameter to an object in 
    //order to include password
    data: {
        ...args.data,
        password
    }
}, info)
},



async deleteUser(parent, args, { prisma }, info){
const userExists = await prisma.exists.User({ id: args.id})
if (!userExists){
    throw new Error('User not found')
}
return prisma.mutation.deleteUser({
    where: {
        id: args.id
    }
}, info)
},
async updateUser(parent, args, { prisma }, info){
    return prisma.mutation.updateUser ({
        where:{
            id: args.id
        },
        data: args.data
    }, info)
},
async createPost(parent, args, { prisma }, info){
    return prisma.mutation.createPost ({
        
        data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author:{
                connect:{
                    id: args.data.author
                }
            }
        }
    }, info)


},
async deletePost(parent, args, { prisma }, info){
    return prisma.mutation.deletePost({
        where:{
            id: args.id
        }
        
    }, info)
},
async updatePost(parent, args, { prisma }, info){
return prisma.mutation.updatePost({
    where:{
        id: args.id
    },
    data: args.data
}, info)
}, 
async createComment(parent, args, { prisma }, info){
    return prisma.mutation.createComment({
        data:{
            text: args.data.text,
        author:{
            connect:{
                id: args.data.author
            }
        },
        post:{
            connect: {
                id: args.data.post
            }
        }
    }
    }, info)
},
deleteComment(parent, args, { prisma }, info){
return prisma.mutation.deleteComment({
    where: {
        id: args.id
    }
}, info)

},
updateComment (parent, args, { prisma }, info){
return prisma.mutation.updateComment({
    where:{
        id: args.id
    },
data: args.data

    
}, info)

}
    }

export { Mutation as default }