const express = require("express");
const app = express();

const notes = require("./data/notes-data");

app.use(express.json());

app.get("/notes/:noteId", (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote == undefined) {
    next(`Note id not found: ${req.params.noteId}`);
  } else {
    res.json({ data: foundNote });
  }
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

let lastPostId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

// TODO: Add ability to create a new note
app.post("/notes", (req, res, next) => {
  const { data: { text } = {} } = req.body;

  if (text) {
    const newNote = {
      id: ++lastPostId,
      text: text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
  } else {
    next();
  }
});

// TODO: add not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// TODO: Add error handler
app.use((error, req, res, next) => {
  res.status(400).send(error);
});

module.exports = app;