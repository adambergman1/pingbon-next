import dbConnect from '../../../lib/mongoose';
import Player from '../../../lib/models/Player';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'PATCH':
      await editPlayer(req, res);
      break;
    case 'DELETE':
      await deletePlayer(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not supported' });
      break;
  }
}

async function editPlayer(req, res) {
  const values = {};

  Object.keys(req.body).forEach((prop) => {
    values[prop] = req.body[prop];
  });

  try {
    const updatedPlayer = await Player.updateOne(
      { _id: req.query.id },
      { $set: values }
    );
    res.send(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deletePlayer(req, res) {
  const { id } = req.query;
  try {
    const result = await Player.deleteOne({ _id: id });

    if (result.n === 0) {
      return res.status(404).json({ error: 'Player does not exist' });
    }

    res.status(200).json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
}
