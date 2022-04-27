const express = require("express");
const app = express();

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

app.use(express.json());

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contact = persons.find((persons) => persons.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }
  const nameExists =
    persons.indexOf((persons) => persons.name === req.body.name) === -1;
  if (nameExists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const newContact = {
    id: persons.length + 1,
    name: req.body.name,
    number: req.body.number,
  };
  persons = [...persons, newContact];

  res.send(newContact);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
