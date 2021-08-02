const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'My first app in NodeJS',
    author: 'Alejandro Mejia',
    url: 'http://google.com/my-first-app',
    likes: 0,
    id: '60fa12a94eeecd3f81669ac7',
  },
  {
    title: 'My second app in NodeJS',
    author: 'Alejandro Mejia',
    url: 'http://google.com/my-second-app',
    likes: 0,
    id: '60fa12a94eeecd3f81669ac7',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
}
