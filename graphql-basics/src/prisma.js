//50 setting up prisma binding with a
//constructor function

import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    //50 constructor function that takes
    //50 single object argument
    //50 options object where we configure node.js to endpoint
    //typeDefs comes from what prisma auto generates from our datamodel.graphql page
    //but we need help from  graphql-cli  to accomplish connection
    typeDefs:'src/genrated/prisma.graphql',
    endpoint: 'localhost:4466'

})