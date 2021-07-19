const mongoose = require("mongoose");

// If terminal command doesn't have the password (3rd argument) it will end the instruction
if (process.argv.length <= 2) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// Get password from terminal command
const password = process.argv[2];
const dbname = "phonebook-app";

// Url from MongoDB when a Cluster is created
const url = `mongodb+srv://alejomejia:${password}@cluster0.296pb.mongodb.net/${dbname}?retryWrites=true&w=majority`;

// Connect to MongoDB using url
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

// If only password, show persons in db
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log(
    "Please provide name and number as an argument: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}
