//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'
//24 npm install uuid
import uuidv4 from 'uuid/v4'

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
    text: 'comment 20 text',
    author: '1',
    post: '10'
    }, {
        id: '21',
        text: 'comment 21 text',
        author: '1',
        post: '10'
    }, {
        id: '22',
        text: 'comment 22 text',
        author: '2',
        post: '11'
    }, {
        id: '23',
        text: 'comment 23 text',
        author: '3',
        post: '12'
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

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
    
    //24 Mutation resolver
    Mutation:{
        createUser(parent, args, ctx, info){
            //24 use uuid to create id, first check if email is taken
            const emailTaken = users.some((user)=> user.email === args.email)
            if (emailTaken){
                throw new Error('Email taken')
            }
            //use the uuidv4 to create unique id, assign data to a thing called user singular
            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                args: args.age
            }
            //push that newly created singular user thing onto our allready established users plural array
            users.push(user)
            return user

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
        },
        //lesson 22 set up resolver for Post->comments type definition:
        comments(parent, args, ctx, info){
            // return comments.find(()=>{
            //     return comments.id === parent.comments
            //I tried to do the above, instructor did:
            return comments.filter((comment)=>{
                return comment.post === parent.id
            })
            }
        },
    

//19 setting up another relational resolver.  When you have custom relational data
// that is non-scalar items defined in your type, that relational data 
//needs it's own sub resolver, so:
User:{
    posts(parent, args, ctx, info){
        return posts.filter((post)=>{
            return post.author === parent.id
        })
    },
    comments(parent, args, ctx, info){
        //return comments
        //still not getting the connections,
        //i tried to just return comments when instructur:
        return comments.filter((comment)=>{
            return comment.author === parent.id
        })
    }
},
//added in lesson 21:
Comment:{
    author(parent, args, ctx, info){
        // return comments.filter((comment)=>{
        //     return comment.author === parent.id
        //I don't have a grasp of how things are related yet,
        //I tried to do the above, when instructor did:
     return users.find((user)=>{
            return user.id === parent.author
        })
        },
        //lesson 22 add resolver for Comment->field type definition:
        post(parent, args, ctx, info){
            return posts.find((post)=>{
            return post.id === parent.post
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