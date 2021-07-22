require('dotenv').config()
const mongoose = require('mongoose')

// Url from MongoDB when a Cluster is created
const url = process.env.MONGODB_URI

// Connect to MongoDB using url
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

// If only password, show persons in db
if (process.argv.length === 2) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3 || process.argv.length > 4) {
  console.log(
    'Please provide name and number as an argument: node mongo.js <name> <number>'
  )
  process.exit(1)
}
