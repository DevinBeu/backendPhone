const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const requestLogger = (req, res, next) => {
  console.log(`method:`, req.method);
  console.log(`path:`, req.path);
  console.log(`body:`, req.body);
  console.log(`---`);
  next();
};
app.use(requestLogger);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint round here " });
};

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

const generateId = () => Math.floor(Math.random() * 10000);

// app.get("/", (req, res) => {
//   res.send(`<h1>Hello world !</h1>`);
// });

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  let id = req.params.id;
  let person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "person not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  let id = req.params.id;
  let person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name is missing or num is missing" });
  }
  const person = { id: generateId(), name: body.name, number: body.number };
  persons.push(person); // Add the new person to the list
  res.status(201).send(person);
});

app.get("/info", (req, res) => {
  let string = `Phonebook has info for ${persons.length} people`;
  let date = new Date().toString();
  res.json({ info: `${string} ${date}` });
});

app.use(express.static("dist")); // Serve static files after defining routes
app.use(unknownEndpoint);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
