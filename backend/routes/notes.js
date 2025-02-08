const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const {date, note} = req.body;
  const userId = req.user.id;

  if (moment(date).isBefore(moment(), 'day')) {
    return res.status(400).send('Cannot save notes for past dates.');
  }

  try {
    const existingNote = await Note.findOne({userId, date});
    if (existingNote) {
      existingNote.note = note;
      await existingNote.save();
    } else {
      const newNote = new Note({userId, date, note});
      await newNote.save();
    }
    res.status(200).send('Note saved');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:date', authMiddleware, async (req, res) => {
  const {date} = req.params;
  const userId = req.user.id;

  try {
    const note = await Note.findOne({userId, date});
    res.status(200).json(note || {});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
