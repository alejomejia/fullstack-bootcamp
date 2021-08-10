const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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
    id: '60fa12a94eeecd3f81669ac8',
  },
]

const testUser = {
  username: 'root',
  password: 'sekret',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const getUserId = async () => {
  const usersResponse = await api.get('/api/users')
  return usersResponse.body[0].id
}

const getUserToken = async () => {
  const response = await api.post('/api/login').send(testUser)
  return response.body.token
}

module.exports = {
  initialBlogs,
  testUser,
  blogsInDb,
  usersInDb,
  getUserId,
  getUserToken,
}
