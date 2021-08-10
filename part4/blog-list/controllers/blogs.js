const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)

  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body

  const user = await User.findById(req.user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)

  const blogOwnerId = blog.user.toString()

  const userFromDb = await User.findById(req.user)
  const userId = userFromDb._id.toString()

  if (blogOwnerId === userId) {
    await Blog.findByIdAndRemove(id)
    res.status(204).end()
  } else {
    return res
      .status(401)
      .json({ error: 'blog cannot be deleted because owner is not the same' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  const blog = {
    content: body.content,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  res.json(updatedBlog)
})

module.exports = blogsRouter
