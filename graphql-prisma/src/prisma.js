//50 setting up prisma binding with a
//constructor function

import { Prisma } from 'prisma-binding'
import { Readable } from 'stream';
import { text } from 'body-parser';

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
//prisma.query  prisma.mutation prisma.subscription prisam.exists

//all prisma methods take 2 arguments: operation and selection set
prisma.query.users(null, '{ id name email }')
    //the above returns a promise so
    .then((data) => {
        // 51 use the JSON.stringify with 3 defined parameters 
        // to make console output more Readable similar 
        // formatt to playground
        console.log(JSON.stringify(data, undefined, 2))
    })

    // 51 challenge:
    // use comments query to fetch all comments, grab id and text
    // grab comment author id and name
    // view in terminal
prisma.query.comments(null, '{ id text author {id name}}').then((data)=>{
    console.log(JSON.stringify(data, undefined, 2))
})