require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Contact = require("./models/contact");
const cors = require("cors");

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :response-time :body"));

app.get("/api/persons", (req, res, next) => {
  Contact.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
  res.status(204).end();
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }
  const contact = new Contact({
    name: req.body.name,
    number: req.body.number,
  });
  Contact.findOne({ name: contact.name }).then((response) => {
    if (response) {
      return res.status(403).send({ error: "Contact already in the database" });
    }
    contact
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json(result);
      })
      .catch((error) => {
        next(error);
      });
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const newContact = {
    name: req.body.name,
    number: req.body.number,
  };

  Contact.findByIdAndUpdate(req.params.id, newContact, { new: true })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response
      .status(400)
      .send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
