import getUserId from '../utils/getUserId'

const Query = {
  
        users(parent, args, { db, prisma }, info) {
            const opArgs = {}
            if(args.query){
                opArgs.where = {
                    OR: [{
                        name_contains: args.query
                    },{
                        email_contains: args.query
                    }]
                }
            }
            return prisma.query.users(opArgs, info)
            //I was trying to get fancy and return a token as well, didn't work:
            // const user = prisma.query.users(opArgs, info)
            // return {
            //     user,
            //     token: jwt.sign({ userId: user.id }, 'thisisasecret')
            // }
        
            
            
            // if (!args.query) {
            //     return db.users
            // }
            // return db.users.filter((user) => {
            //     return user.name.toLowerCase().includes(args.query.toLowerCase())
            // })
        },
        posts(parent, args, { db, prisma }, info) {
            const opArgs = {
                where: {
                    published: true
                }
            }

            if (args.query) {
                opArgs.where.OR = [{

                    title_contains: args.query
                    }, {
                        body_contains: args.query
                    }]
                }
            

            return prisma.query.posts(opArgs, info)
            
            
            // if (!args.query) {
            //     return db.posts
            // }
            // return db.posts.filter((post) => {
            //     const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            //     const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            //     return isTitleMatch || isBodyMatch
            // })
        },
        comments(parent, args, { prisma }, info) {

            return prisma.query.comments(null, info)

        },

        async me(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)
            return prisma.query.user({
                where: {
                    id: userId
                }
            })
        },
        async post(parent, args, { prisma, request }, info) {
            //74
            const userId = getUserId(request, false)
            //74 we are going to query posts instead of post
            //because posts give us more query options than post
            const posts = await prisma.query.posts({
                where:{
                    id: args.id,
                    OR: [{
                        published: true
                    },{
                        author:{
                            id: userId
                        }
                    }]
                }
            }, info)
            if(posts.length === 0){
                throw new Error ('Post not found')
            }
            return posts[0]


        },

        //75 Challenge
    async myPosts(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)
            const opArgs = {
                where:{
                    author:{
                        id: userId
                    }
                }
            }
            if(args.query){
                opArgs.where.OR = [{
                    title_contains: args.query
                },{
                    body_contains: args.query
                }]
            }
        return prisma.query.posts(opArgs, info)
        }
        
    }

export { Query as default }

