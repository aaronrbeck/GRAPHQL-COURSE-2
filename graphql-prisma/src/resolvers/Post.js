const Post = {

// 61. becuase prisma has relational data searches
// built into it, we don't need the following anymore
// over in query.js we are passing in info which carries
// with it the following functionality, allowing
// queries to happen in the playground?  not totally following, but ok

//     author(parent, args, { db }, info){
//         return db.users.find((user) => {
//             return user.id === parent.author
//         })
//         },
// comments(parent, args, { db }, info){
//     return db.comments.filter((comment) => {
//         return comment.post === parent.id
//     })
// }
        }
export { Post as default }
