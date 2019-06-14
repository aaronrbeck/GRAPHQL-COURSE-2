//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'

//14 Type definitaions (shema)
const typeDefs =`
    type Query {
        greeting(name: String, position: String): String!
        me: User!
        post: Post!
        add(a: Float!, b: Float!): Float!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
    
`

//12 challenge Resolvers
const resolvers = {

    Query: {
        add(parent, args, ctx, info){
            return args.a + args.b
        },
        greeting(parent, args, ctx, info){
            if (args.name && args.position){
                return `Hello, ${args.name}! You are my favorite ${args.position}.`
            } else {
                return "Hello"
            }
            
            
        },
        me(){
            return{
                id: '123098',
                name: "mike",
                email: 'mike@example.com',
                age: 28
            }
        },
        post(){
            return{
                id:'p123',
                title: 'post 123 title',
                body: 'post 123 body',
                published: false
            }
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