const supertest = require('supertest')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const userName = helper.testUser.username
  const userPassword = helper.testUser.password

  const passwordHash = await bcrypt.hash(userPassword, 10)
  const user = new User({ username: userName, passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {
  test('creation succeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'alejomejia',
      name: 'Alejandro Mejia',
      password: 'asd1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('check that an invalid user is not created in db', () => {
  test('user with no username will not be created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Testeandro Mejia',
      password: 'abcd1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user with no password will not be created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testeandrom',
      name: 'Testeandro Mejia',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user with username length less than 3 will not be created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'te',
      name: 'Testeandro Mejia',
      password: 'asd87!alksdm!',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user with password length less than 3 will not be created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testeandrom',
      name: 'Testeandro Mejia',
      password: 'as',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => mongoose.connection.close())
