//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'
//24 npm install uuid
import uuidv4 from 'uuid/v4'

//17 added sample user data
let users = [{
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
let posts = [{
    id: '10',
    title: 'post2title',
    body: 'post2 body',
    published: true,
    author: '1'
},
    {
        id: '11',
        title: 'post1title',
        body: '',
        published: false,
        author:'1'
    },
    {
        id: '12',
        title: 'post3title',
        body: 'post3  body',
        published: false,
        author:'2'
    },
]
let comments = [{
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
        author: '1',
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
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput{
        name: String!
        email: String!
        age: Int
    }
        input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
        }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
        comments(parent, args, ctx, info) {
            return comments

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

    },
    
    //24 Mutation resolver
    Mutation:{
        createUser(parent, args, ctx, info){
            //24 use uuid to create id, first check if email is taken
            const emailTaken = users.some((user)=> user.email === args.data.email)
            if (emailTaken){
                throw new Error('Email taken')
            }
            //use the uuidv4 to create unique id, assign data to a thing called user singular
            const user = {
                id: uuidv4(),
                ...args.data
            }
            //push that newly created singular user thing onto our allready established users plural array
            users.push(user)
            return user

        },
        //28 deleteUser mutation resolver
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user)=> user.id === args.id)
            if (userIndex === -1){
                throw new Error('User not found')
            }
            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter((post)=>{
                const match = post.author === args.id
                if (match){
                    comments = comments.filter((comment)=> comment.post !== post.id)
                }
                return !match
            }
            )
            comments = comments.filter((comment)=> comment.author !== args.id)
        return deletedUsers[0]
        
        },
        //25 createPost mutation resolver
        createPost(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            if (!userExists){
                throw new Error('User not found')

            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post)
            return post
        },
        //29 challenge
        deletePost(parent, args, ctx, info){
            const postIndex = posts.findIndex((post)=> post.id === args.id)
            if (postIndex === -1){
                throw new Error('post does not exist')
            }
            const deletedPosts = posts.splice(postIndex, 1)
        comments = comments.filter((comment) => comment.post !== args.id)
        return deletedPosts[0]
        },
        //25 challenge:
        createComment(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post && post.published)
            if (!userExists || !postExists) {
                throw new Error('Unable to find user and post')

            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }
            comments.push(comment)
            return comment
        },
        //29 challenge:
        deleteComment(parent, args, ctx, info){
            const commentIndex = comments.findIndex((comment)=> comment.id === args.id)
            if (commentIndex === -1){
                throw new Error('Comment does not exist')
            }
            const deletedComments = comments.splice(commentIndex, 1)
            return deletedComments[0]
        },
    },
    
    
    
    
    //18 relational data resolvers
    //types that include relational data need their own resovlers in addition to the query resolvers
    
    
    Post:{
        author(parent, args, ctx, info){
            //the Post information lives on the parent argument so we can use that to figure out which user object needs to get returned
            return users.find((user)=>
        {
            return user.id === parent.author
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