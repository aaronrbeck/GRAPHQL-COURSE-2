//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'

//12 Challenge Type definitaions (shema)
const typeDefs =`
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        inStock: Boolean!
    }
`

//12 challenge Resolvers
const resolvers = {
    Query: {
        title(){
            return "the war of art"
        },
        price(){
            return 12.99
        },
        releaseYear(){
            return null
        },
        rating(){
            return 5
        },
        inStock(){
            return true
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