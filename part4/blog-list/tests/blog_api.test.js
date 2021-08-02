const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blogs api', () => {
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
    const newBlog = {
      title: 'How to test a POST request using Jest',
      author: 'Alejandro Mejia',
      url: 'http://google.com/how-to-test-post-using-jest',
      likes: 0,
      id: '60fa12a94eeecd3f81669ac8',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map((n) => n.title)
    expect(title).toContain('How to test a POST request using Jest')
  })

  test('if new item likes missing, is 0 by default', async () => {
    const newBlog = {
      title: 'How to test a default key with Jest',
      author: 'Alejandro Mejia',
      url: 'http://google.com/how-to-test-default-key',
      id: '60fa12a94eeecd3f81669ac9',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const lastBlogAdded = blogsAtEnd[blogsAtEnd.length - 1]
    expect(lastBlogAdded.likes).toBe(0)
  })

  test('if title and url is missing, response is 400', async () => {
    const newBlog = {
      author: 'Alejandro Mejia',
      id: '60fa12a94eeecd3f81669ac1',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('a single blog post can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const title = blogsAtEnd.map((blog) => blog.title)
    expect(title).not.toContain(blogToDelete.title)
  })

  test('blog item can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    console.log(blogsAtStart)

    const updatedItem = {
      ...blogsAtStart[0],
      likes: blogsAtStart[0].likes + 1,
    }

    await api.put(`/api/blogs/${updatedItem.id}`).send(updatedItem).expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(1)
  })

  /*
    test('all blogs are returned', async () => {
      const response = await api.get('/api/notes')
      expect(response.body).toHaveLength(helper.initialNotes.length)
    })

    test('note without content is not added', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })

    test('a specific note is within the returned notes', async () => {
      const response = await api.get('/api/notes')
      const contents = response.body.map(r => r.content)
      expect(contents).toContain(
        'Browser can execute only Javascript'
      )
    })

    test('the first note is about HTTP methods', async () => {
      const response = await api.get('/api/notes')
      expect(response.body[0].content).toBe('HTML is easy')
    })

    test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

      expect(resultNote.body).toEqual(processedNoteToView)
    })
  */
})

afterAll(() => mongoose.connection.close())
