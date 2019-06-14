//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'

//11 Type definitaions (shema)
const typeDefs =`
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

//11 Resolvers
const resolvers = {
    Query: {
        hello(){
            return "this is first query"
        },
        name(){
            return "andrew mead"
        },
        bio(){
            return "My name is aaron.  I'm from Idaho"
        },
        location(){
            return "idaho"
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up')
})