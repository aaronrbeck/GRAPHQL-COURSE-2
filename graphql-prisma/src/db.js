//30 refactoring: created this file
const users = [{
    id: '1',
    name: 'andrew',
    email: 'andrew@example.com',
    age: 27


}, {
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
    published: true,
    author: '1'
},
{
    id: '11',
    title: 'post1title',
    body: '',
    published: false,
    author: '1'
},
{
    id: '12',
    title: 'post3title',
    body: 'post3  body',
    published: false,
    author: '2'
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
    author: '1',
    post: '12'
},
]
const db = {
    users,
    posts,
    comments
}

export { db as default }