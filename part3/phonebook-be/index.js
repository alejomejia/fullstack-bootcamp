const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Logger

morgan.token("person", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :person"));

// Middlewares

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Data
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Helpers
const generateId = () => {
  return Math.floor(Math.random() * (50000 - 1 + 1)) + 1;
};

// Logic
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const totalPeople = persons.length;
  const message = `<p>Phonebook has info for ${totalPeople} people</p>`;
  const timestamp = `<p>${new Date()}</p>`;

  res.send(message + timestamp);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name is required",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number is required",
    });
  }

  const isNameDuplicated = persons
    .map((person) => person.name)
    .includes(body.name);

  if (isNameDuplicated) {
    return res.status(400).json({
      error: "name already exists",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: String(body.number),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.use(unknownEndpoint);

// Final setup
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
