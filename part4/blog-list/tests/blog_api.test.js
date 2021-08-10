const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('blogs api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const initialBlogs = helper.initialBlogs
    const userId = await helper.getUserId()

    initialBlogs.map((blog) => (blog.userId = userId))

    await Blog.insertMany(initialBlogs)
  })

  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
  })

  test('the items have id as key', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('a valid blog can be added', async () => {
    const userId = await helper.getUserId()
    const userToken = await helper.getUserToken()

    const newBlog = {
      title: 'How to test a POST request using Jest',
      author: 'Alejandro Mejia',
      likes: 0,
      url: 'http://google.com/how-to-test-post-using-jest',
      userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userToken}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map((n) => n.title)
    expect(title).toContain('How to test a POST request using Jest')
  })

  test('if new item likes missing, is 0 by default', async () => {
    const userId = await helper.getUserId()
    const userToken = await helper.getUserToken()

    const newBlog = {
      title: 'How to test a default key with Jest',
      author: 'Alejandro Mejia',
      url: 'http://google.com/how-to-test-default-key',
      userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userToken}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const lastBlogAdded = blogsAtEnd[blogsAtEnd.length - 1]
    expect(lastBlogAdded.likes).toBe(0)
  })

  test('if title and url is missing, response is 400', async () => {
    const userId = await helper.getUserId()
    const userToken = await helper.getUserToken()

    const newBlog = {
      author: 'Alejandro Mejia',
      userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userToken}`)
      .send(newBlog)
      .expect(400)
  })

  test.only('a single blog post can be deleted only by the owner', async () => {
    const userToken = await helper.getUserToken()

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const title = blogsAtEnd.map((blog) => blog.title)
    expect(title).not.toContain(blogToDelete.title)
  })

  test('blog item can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedItem = {
      ...blogsAtStart[0],
      likes: blogsAtStart[0].likes + 1,
    }

    await api.put(`/api/blogs/${updatedItem.id}`).send(updatedItem).expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(1)
  })
})

afterAll(() => mongoose.connection.close())
