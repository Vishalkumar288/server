const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Note = mongoose.model("Note", {
  dateTime: String,
  note: String,
});

app.post("/notes/create", async (req, res) => {
  const { note, dateTime } = req.body;
  // console.log()

  if (!note || !dateTime) {
    return res
      .status(400)
      .json({ error: "dateTime and note are required in the request body" });
  }

  // Create a new note using the Mongoose model
  const newNote = new Note({ dateTime, note });

  try {
    // Save the note to the database
    await newNote.save();
    res.json({ message: "Note created" });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/notes", async (req, res) => {
  try {
    // Fetch all notes from the database
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server Started at port ${process.env.PORT_NUMBER}`);
});
