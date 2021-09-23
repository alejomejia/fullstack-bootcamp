const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('---')
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')

  next()
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    req.token = auth.substring(7)
  }

  next()
}

const userExtractor = (req, res, next) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  // If there is no token, or the object decoded from the token
  // does not contain the user's identity (decodedToken.id is undefined)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  req.user = decodedToken.id

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.name)
  
  const ERRORS = {
    CastError: res => res.status(400).send({ error: 'malformatted id' }),
    ValidationError: (res, { message }) => res.status(400).json({ error: error.message }),
    JsonWebTokenError: res => res.status(401).json({ error: 'invalid token' }),
    TokenExpiredError: res => res.status(401).json({ error: 'token expired' }),
    defaultError: res => res.status(500).end()
  }

  const handler = ERRORS[error.name] || ERRORS.defaultError
  handler(res, error)

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}
