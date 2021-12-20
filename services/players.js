import dbConnect from '../lib/mongoose';
import Player from '../lib/models/Player';
dbConnect();

export const getAllPlayers = () => Player.find({}).select('-__v');

export const addPlayer = (payload) => Player.create(payload);

export const editPlayer = (id, playerValues) => {
  const values = {};

  Object.keys(playerValues).forEach((prop) => {
    values[prop] = playerValues[prop];
  });

  return Player.updateOne({ _id: id }, { $set: values });
};

export const deletePlayer = (id) => Player.deleteOne({ _id: id });
