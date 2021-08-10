const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    url: 1,
    likes: 1,
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.username) {
    return res.status(400).json({
      error: 'User validation failed: `username` is required.',
    })
  }

  if (!body.password) {
    return res.status(400).json({
      error: 'User validation failed: `password` is required.',
    })
  }

  if (body.username.length < 3) {
    return res.status(400).json({
      error:
        'User validation failed: `username` should have 3 characters at least',
    })
  }

  if (body.password.length < 3) {
    return res.status(400).json({
      error:
        'User validation failed: `password` should have 3 characters at least',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    blogs: [],
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = usersRouter
