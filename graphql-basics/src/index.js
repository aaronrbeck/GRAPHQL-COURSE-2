//11 npm install graphql-yoga then import
import { GraphQLServer } from 'graphql-yoga'
//24 npm install uuid
import uuidv4 from 'uuid/v4'
import db from './db'



//12 challenge Resolvers
const resolvers = {

    Query: {
        users(parent, args, { db }, info){
            if (!args.query){
        return db.users
        }
        return db.users.filter((user)=>{
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
        posts(parent, args, { db }, info){
            if (!args.query){
                return db.posts
            }
            return db.posts.filter((post)=>{
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments

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
        createUser(parent, args, { db }, info){
            //24 use uuid to create id, first check if email is taken
            const emailTaken = db.users.some((user)=> user.email === args.data.email)
            if (emailTaken){
                throw new Error('Email taken')
            }
            //use the uuidv4 to create unique id, assign data to a thing called user singular
            const user = {
                id: uuidv4(),
                ...args.data
            }
            //push that newly created singular user thing onto our allready established users plural array
            db.users.push(user)
            return user

        },
        //28 deleteUser mutation resolver
        deleteUser(parent, args, { db }, info){
            const userIndex = users.findIndex((user)=> user.id === args.id)
            if (userIndex === -1){
                throw new Error('User not found')
            }
            const deletedUsers = db.users.splice(userIndex, 1)

            db.posts = db.posts.filter((post)=>{
                const match = post.author === args.id
                if (match){
                    db.comments = db.comments.filter((comment)=> comment.post !== post.id)
                }
                return !match
            }
            )
            db.comments = db.comments.filter((comment)=> comment.author !== args.id)
        return deletedUsers[0]
        
        },
        //25 createPost mutation resolver
        createPost(parent, args, { db }, info){
            const userExists = db.users.some((user) => user.id === args.data.author)
            if (!userExists){
                throw new Error('User not found')

            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            db.posts.push(post)
            return post
        },
        //29 challenge
        deletePost(parent, args, { db  }, info){
            const postIndex = db.posts.findIndex((post)=> post.id === args.id)
            if (postIndex === -1){
                throw new Error('post does not exist')
            }
            const deletedPosts = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter((comment) => comment.post !== args.id)
        return deletedPosts[0]
        },
        //25 challenge:
        createComment(parent, args, { db }, info){
            const userExists = db.users.some((user) => user.id === args.data.author)
            const postExists = db.posts.some((post) => post.id === args.data.post && post.published)
            if (!userExists || !postExists) {
                throw new Error('Unable to find user and post')

            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }
            db.comments.push(comment)
            return comment
        },
        //29 challenge:
        deleteComment(parent, args, { db }, info){
            const commentIndex = db.comments.findIndex((comment)=> comment.id === args.id)
            if (commentIndex === -1){
                throw new Error('Comment does not exist')
            }
            const deletedComments = db.comments.splice(commentIndex, 1)
            return deletedComments[0]
        },
    },
    
    
    
    
    //18 relational data resolvers
    //types that include relational data need their own resovlers in addition to the query resolvers
    
    
    Post:{
        author(parent, args, { db }, info){
            //the Post information lives on the parent argument so we can use that to figure out which user object needs to get returned
            return db.users.find((user)=>
        {
            return user.id === parent.author
        })
        },
        //lesson 22 set up resolver for Post->comments type definition:
        comments(parent, args, { db }, info){
            // return comments.find(()=>{
            //     return comments.id === parent.comments
            //I tried to do the above, instructor did:
            return db.comments.filter((comment)=>{
                return comment.post === parent.id
            })
            }
        },
    

//19 setting up another relational resolver.  When you have custom relational data
// that is non-scalar items defined in your type, that relational data 
//needs it's own sub resolver, so:
User:{
    posts(parent, args, { db }, info){
        return db.posts.filter((post)=>{
            return post.author === parent.id
        })
    },
    comments(parent, args, { db }, info){
        //return comments
        //still not getting the connections,
        //i tried to just return comments when instructur:
        return db.comments.filter((comment)=>{
            return comment.author === parent.id
        })
    }
},
//added in lesson 21:
Comment:{
    author(parent, args, { db }, info){
        // return comments.filter((comment)=>{
        //     return comment.author === parent.id
        //I don't have a grasp of how things are related yet,
        //I tried to do the above, when instructor did:
     return db.users.find((user)=>{
            return user.id === parent.author
        })
        },
        //lesson 22 add resolver for Comment->field type definition:
        post(parent, args, { db }, info){
            return db.posts.find((post)=>{
            return post.id === parent.post
    })
        }
    }
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context:{
        db

    }
})

server.start(() => {
    console.log('The server is up')
})