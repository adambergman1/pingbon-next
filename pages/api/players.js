import dbConnect from '../../lib/mongoose';
import * as service from '../../services/players';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      await getAllPlayers(req, res);
      break;
    case 'POST':
      await addPlayer(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not supported' });
      break;
  }
}

async function getAllPlayers(req, res) {
  try {
    const players = await service.getAllPlayers();
    res.send(players);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function addPlayer(req, res) {
  try {
    const player = await service.addPlayer(req.body);
    res.status(201).send(player);
  } catch (error) {
    if (error?.code === 11000) {
      res.status(422).json({ error: 'Name already exists' });
    } else {
      res.status(500).json({ error });
    }
  }
}
