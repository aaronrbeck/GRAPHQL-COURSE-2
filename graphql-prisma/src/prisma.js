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
// prisma.query.users(null, '{ id name posts { id title } }')
    //the above returns a promise so
// .then((data) => {
        // 51 use the JSON.stringify with 3 defined parameters 
        // to make console output more Readable similar 
        // formatt to playground
// console.log(JSON.stringify(data, undefined, 2))
// }).catch((error)=>{
// console.error("there is an error in prisma.query.users")
// })


    // 51 challenge:
    // use comments query to fetch all comments, grab id and text
    // grab comment author id and name
    // view in terminal
// prisma.query.comments(null, '{ id text author {id name}}').then((data)=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })


// 52 node origination mutation
// prisma.mutation.createPost({
//     data: {
//         title: "GQL 101",
//     body: "",
//     published: false,
//     author:{
//         connect: {
//             id: "cjx3ai49e00fv0791tf4bn3fh"
//         }
//     }
// }
// }, '{ id title body published }').then((data) => {
//     console.log(data)
            //***** */move query call into this as a chained async call:
//     return prisma.query.users(null, '{ id name posts { id title }}')
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })
            // ********since I've been getting UnhandledPromiseRejectionWarning: 
            // ********Unhandled promise rejection., I will:
// .catch((error)=>{
// console.error(" there is an error in prisma.query.users")
// })
            // *****the above seems to be writing and returning but
            // *****I'm still getting an unhandle promise rejection error
            // *****for some reason and my error message is not running
            // *****for some reason


            // ******52 challange
            // ******updated newly created post changing body, mark as published
            // ******fetch all posts (id, title, body, published) print to console
            // ******view the list of posts and confirm updates
prisma.mutation.updatePost({
    where:{
        id: "cjx3rr79h00tp0791witxl5mk"
    },

    data:{
        body:"this is how to get started with gql",
            published: true
    }
}, '{ id title body published }').then((data) => {
    console.log(data)
    return prisma.query.posts(null, '{ id title body published }')
}).then((data) => {
    console.log(data)
})
