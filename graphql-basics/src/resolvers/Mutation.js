
import uuidv4 from 'uuid/v4'


const Mutation = {
    createUser(parent, args, { db }, info){
        const emailTaken = db.users.some((user) => user.email === args.data.email)
            if (emailTaken){
    throw new Error('Email taken')
}
const user = {
    id: uuidv4(),
    ...args.data
}
db.users.push(user)
return user

        },
deleteUser(parent, args, { db }, info){
    const userIndex = users.findIndex((user) => user.id === args.id)
    if (userIndex === -1) {
        throw new Error('User not found')
    }
    const deletedUsers = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
            db.comments = db.comments.filter((comment) => comment.post !== post.id)
        }
        return !match
    }
    )
    db.comments = db.comments.filter((comment) => comment.author !== args.id)
    return deletedUsers[0]

},
updateUser(parent, args, { db }, info){
    const { id, data } = args
    const user = db.users.find((user)=> user.id === id)
    if (!user){
        throw new Error ('User not found')

    }
    if (typeof data.email === 'string'){
        const emailTaken = db.users.some((user) => user.email === data.email)
        if (emailTaken){
            throw new Error ('Email taken')

        }
        user.email = data.email
    }
    if (typeof data.name === 'string'){
        user.name = data.name
    }
    if (typeof data.age !== 'undefined'){
        user.age = data.age
    }
    return user
},
createPost(parent, args, { db, pubsub }, info){
    const userExists = db.users.some((user) => user.id === args.data.author)
    if (!userExists) {
        throw new Error('User not found')

    }
    const post = {
        id: uuidv4(),
        ...args.data
    }
    db.posts.push(post)
    //lesson 37 challeng added the pubsub.publish line.  I'm not clear on the two parameters defined below
    if (args.data.published){
        //lesson 38 modified to accomodate payload formatting from:
        // pubsub.publish('post', { post })
        //to:
        pubsub.publish('post',{
            post:{
                mutation: 'CREATED',
                data: post
            }
        })


    }
    return post

},
deletePost(parent, args, { db, pubsub }, info){
    const postIndex = db.posts.findIndex((post) => post.id === args.id)
    if (postIndex === -1) {
        throw new Error('post does not exist')
    }
    //in lesson 38 we destructured from const deletedPosts
    //to const [post], but I don't totally understand how that works
    const [post] = db.posts.splice(postIndex, 1)
    db.comments = db.comments.filter((comment) => comment.post !== args.id)
   if (post.published){
       pubsub.publish('post',{
           post:{
               mutation: 'DELETED',
               data: post
           }
       })
   }
    return post
},
updatePost(parent, args, { db, pubsub }, info){
    const { id, data } = args
    const post = db.posts.find((post) => post.id === id)
    //38 for subscription we need to know if the original post was published or unpublished
    const originalPost = {...post}
    if (!post) {
        throw new Error('Post not found')

    }
    if (typeof data.title === 'string') {
        post.title = data.title
    }
    if (typeof data.body === 'string') {
        post.body = data.body
    }
    if (typeof data.published === Boolean) {
        post.published = data.published

        if (originalPost.published && !post.published){
            //in the case that the post has been deleted
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: originalPost
                }
            })
        } else if (!originalPost.publsihed && post.published){
        //in the case that post has been created
        pubsub.publish('post', {
            post:{
                mutation: 'CREATED',
                data: post
            }
        })
    }
    } else if (post.published){
    //in the case that the post has been updated
        pubsub.publish('post', {
            post:{
                mutation: 'UPDATED',
                data: post
            }
        })
    }
    return post


}, 
createComment(parent, args, { db, pubsub }, info){
    const userExists = db.users.some((user) => user.id === args.data.author)
    const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

    if (!userExists || !postExists) {
        throw new Error('Unable to find user and post')

    }

    const comment = {
        id: uuidv4(),
        ...args.data
    }
    //39
    db.comments.push(comment)
    //lesson 36 added the pubsub.publish line.  I'm not clear on the two parameters defined below
    pubsub.publish(`comment ${args.data.post}`, {
        comment: {
            mutation: 'CREATED',
            data: comment
        } 
    })


    return comment
},
deleteComment(parent, args, { db, pubsub }, info){
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
    if (commentIndex === -1) {
        throw new Error('Comment does not exist')
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1)
    pubsub.publish(`comment ${deletedComment.post}`, {
        comment: { 
            mutation: 'DELETED',
            data: deletedComment
        }
    })
    return deletedComment
},
updateComment (parent, args, { db, pubsub }, info){
    const { id, data } = args
    const comment = db.comments.find((comment) => comment.id === id)
    if (!comment){
        throw new Error('no such comment')
    }
    if (typeof data.text === 'string') {
        comment.text = data.text
    }
    pubsub.publish('comment ${comment.post}',{
        comment:{
            mutation: 'UPDATED',
            data: comment
        }
    })
    return comment

}
    }

export { Mutation as default }