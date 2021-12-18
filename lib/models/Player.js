import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    default: 1000,
  },
  numberOfPlayedMatches: {
    type: Number,
    default: 0,
  },
});

module.exports =
  mongoose.models.Player || mongoose.model('Player', PlayerSchema);
