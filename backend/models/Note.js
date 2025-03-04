const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  date: {type: String, required: true},
  note: {type: String, required: true},
  redMeat: {type: Number, required: false},
  processedMeat: {type: Number, required: false},
});

module.exports = mongoose.model('Note', NoteSchema);
