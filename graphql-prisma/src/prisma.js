//50 setting up prisma binding with a
//constructor function

import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    //50 constructor function that takes
    //50 single object argument
    //50 options object where we configure node.js to endpoint
    //typeDefs comes from what prisma auto generates from our datamodel.graphql page
    //but we need help from  graphql-cli  to accomplish connection
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'

})


// 51: using Node.js to crud to db
// prisma.query  prisma.mutation prisma.subscription prisam.exists

    //all prisma methods take 2 arguments: operation and selection set




//53
//1. create a new post
//2.  fetch all info about user(author)

// const createPostForUser = async (authorId, data) => {
//     //54integrating prisma.exists:
//     const userExists = await prisma.exists.User({ id: authorId })
//     if (!userExists){
//         throw new Error('User not found')
//     }
//     const post = await prisma.mutation.createPost({
//         data:{
//             ...data,
//             author:{
//                 connect:{
//                     id: authorId
//                 }

//             }
//         }
//     }, '{ author { id name email post { id title published }} }')
//     return post.author 
// }
// createPostForUser('cjx3ai49e00fv0791tf4bn3fh', {
//         title: "Greate books to read",
//         body: "The War of Art",
//         published: true
//     }).then((user) => {
//         console.log(JSON.stringify(user, undefined, 2))
//     }).catch((error) => {
//         console.log(error.message)
//     })



    //53 challenge - use asnync/await with prisma bindings
    //-create updatePostForUser that accepts the post id and data to update
    //update the post (get author id back)
    //fetch the user associated with the updated post and returne the user data
    //grab some fields grabbed for createPostForUser
    //call the function with the ide and data and use a then methods to get the user information
    //print the user infor ot the console and test your work


 const updatePostForUser = async (postId, data) => {
     const postExists = await prisma.exists.Post({ id: postId })
     if (!postExists) {
         throw new Error('Post not found')
     }

    const post = await prisma.mutation.updatePost({
     where: {
         id: postId
     },
     data

     }, //this second argument is the selection set:
     '{ author { id name email posts { id title published }} }')
     return post.author    
}


updatePostForUser("cjx4nso8q01l8079147s768lg", { published: true }).then((user) => {
        console.log(JSON.stringify(user, undefined, 2))
    }).catch((error) => {
        console.log(error.message)
    })

    

// prisma.mutation.updatePost({
//     where:{
//         id: "cjx3rr79h00tp0791witxl5mk"
//     },

//     data:{
//         body:"this is how to get started with gql",
//             published: true
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data)
//     return prisma.query.posts(null, '{ id title body published }')
// }).then((data) => {
//     console.log(data)
// })
