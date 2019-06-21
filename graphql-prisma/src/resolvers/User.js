const User = {
// 61. becuase prisma has relational data searches
// built into it, we don't need the following anymore
// over in query.js we are passing in info which carries
// with it the following functionality, allowing
// queries to happen in the playground?  not totally following, but ok
//     posts(parent, args, { db }, info){
//         return db.posts.filter((post) => {
//             return post.author === parent.id
//         })
//     },
// comments(parent, args, { db }, info){
//     return db.comments.filter((comment) => {
//         return comment.author === parent.id
//     })
// }
}
export { User as default }