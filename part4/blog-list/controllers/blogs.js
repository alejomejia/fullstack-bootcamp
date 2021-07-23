const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs)
  })
})

blogsRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Blog.findById(id)
    .then((blog) => {
      if (blog) {
        res.json(blog)
      } else {
        res.status(400).end()
      }
    })
    .catch((error) => next(error))
})

blogsRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then((savedBlog) => {
      res.status(201).json(savedBlog)
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
