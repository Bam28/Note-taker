const express = require('express');
const path =  require('path');
const fs = require('fs');
const notesAdded = require('./db/db.json');
const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const { request } = require('http');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  res.json(notesAdded)
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
    title,
    text,
    id: uuid(),
    };


  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      // Add a new review
      parsedNotes.push(newNote);

      // Write updated reviews back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated note!')
      );
    }
  });

  const response = {
    status: 'success',
    body: newNote,
  };

  console.log(response);
  res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.delete('/notes/:id', (req, res) => {
  delete notesAdded[req.params.id]
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT} 🚀`)
})