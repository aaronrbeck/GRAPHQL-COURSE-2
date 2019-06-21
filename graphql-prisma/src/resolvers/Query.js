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
        
            
            
            // if (!args.query) {
            //     return db.users
            // }
            // return db.users.filter((user) => {
            //     return user.name.toLowerCase().includes(args.query.toLowerCase())
            // })
        },
        posts(parent, args, { db, prisma }, info) {
            const opArgs = {}

            if (args.query) {
                opArgs.where = {
                    OR: [{
                        body_contains: args.query
                    }, {
                        title_contains: args.query
                    }]
                }
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
        comments(parent, args, { db }, info) {
            return db.comments

        },

        me() {
            return {
                id: '123098',
                name: "mike",
                email: 'mike@example.com',
                age: 28
            }
        },
        post() {
            return {
                id: 'p123',
                title: 'post 123 title',
                body: 'post 123 body',
                published: false
            }
        },

    }

export { Query as default }

