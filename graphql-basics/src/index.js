//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'

//17 added sample user data
const users = [{
    id: '1',
    name: 'andrew',
    email: 'andrew@example.com',
    age: 27


},{
        id: '2',
        name: 'Sarah',
        email: 'sarah@example.com',
    

}
    , {
        id: '3',
        name: 'mike',
        email: 'mike@example.com',
        

    }]
const posts = [{
    id: '10',
    title: 'post2title',
    body: 'post2 body',
    published: true
},
    {
        id: '11',
        title: 'post1title',
        body: '',
        published: false
    },
    {
        id: '12',
        title: 'post3title',
        body: 'post3  body',
        published: false
    },
]

// Type definitaions (shema)
const typeDefs =`
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
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
        users(parent, args, ctx, info){
            if (!args.query){
        return users
        }
        return users.filter((user)=>{
            return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        })
    },
        posts(parent, args, ctx, info){
            if (!args.query){
                return posts
            }
            return posts.filter((post)=>{
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
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