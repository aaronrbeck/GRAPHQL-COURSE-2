import getUserId from '../utils/getUserId'


const Query = {
  
        users(parent, args, { prisma }, info) {
            const opArgs = {
                first: args.first,
            skip: args.skip
            }
            if(args.query){
                opArgs.where = {
                    OR: [{
                        name_contains: args.query
                    }]
                }
            }
            return prisma.query.users(opArgs, info)
        },

        
        posts(parent, args, { db, prisma }, info) {
            const opArgs = {
                first: args.first,
            skip: args.skip,
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

            return prisma.query.comments(opArgs, info)
            const opArgs = {
                 first: args.first,
                skip: args.skip,
                after: args.after

            }

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

    async myPosts(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)
            const opArgs = {
                first: args.first,
                skip: args.skip,
                after: args.after,
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

