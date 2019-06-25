import  bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'
import { assign } from 'apollo-utilities';

//68 take in pw, validate pw length, hash pw, generate auth token
//69 use JSON web token to provide a password token
    //install jsonwebtoken
    //learning:
    // jwt.sign({payload}, secret )
    const token = jwt.sign({ id: 46 }, 'mysecret')
    //payload is not meant to be encrypted - it is public
    console.log(token)
    const decoded = jwt.decode(token) 
    console.log(decoded)
    //we only want to trust what comes back from verified web tokens
    //so:
    const decoded2 = jwt.verify(token, 'mysecret')
    console.log(decoded2)
    //copy webtoken from console, take to jwt.io
    //token sections: header, payload, signiture, seperated by periods, signature is a hash

const Mutation = {
    async createUser(parent, args, { prisma }, info){
        if (args.data.password.length < 8){
            throw new Error ('Password must be 8 characters or longer.')
        }
        //take in plain text pw, return a hashed version
        //take in the user pw from args.data and specify a salt(a number of random numbers to include in hashing)
        const password = await bcrypt.hash(args.data.password, 10)
        //69 jws
        const user = await prisma.mutation.createUser({
    //68 modified the data parameter to an object in 
    //order to include password
    data: {
        ...args.data,
        password
    }
})
    return {
        user,
        token: jwt.sign({ userId: user.id }, 'thisisasecret')
    }
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