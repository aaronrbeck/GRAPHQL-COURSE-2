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
const comments = [{
    id: '20',
    text: 'comment 20 text'
}, {
        id: '21',
        text: 'comment 21 text'
    }, {
        id: '22',
        text: 'comment 22 text'
    }, {
        id: '23',
        text: 'comment 23 text'
    },
]

// Type definitaions (shema)
const typeDefs =`
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
    type Comment {
        id: ID!
        text: String!
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
            return user.name.toLowerCase().includes(args.query.toLowerCase())
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
        },
        comments(parent, args, ctx, info){
            return comments

        }

    },
    //18 relational data resolvers
    //types that include relational data need their own resovlers in addition to the query resolvers
    Post:{
        author(parent, args, ctx, info){
            //the Post information lives on the parent argument so we can use that to figure out which user object needs to get returned
            return users.find(()=>
        {
            return users.id === parent.author
        })
        }
    }
,
//19 setting up another relational resolver.  When you have custom relational data
// that is non-scalar items defined in your type, that relational data 
//needs it's own sub resolver, so:
User:{
    posts(parent, args, ctx, info){
        return posts.filter((post)=>{
            return post.author === parent.id
        })
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