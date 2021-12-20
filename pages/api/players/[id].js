import * as service from '../../../services/players';

export default async function handler(req, res) {
  const { method } = req;

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
  const id = req.query.id;
  const values = req.body;

  try {
    const updatedPlayer = await service.editPlayer(id, values);
    res.send(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deletePlayer(req, res) {
  const { id } = req.query;
  try {
    const result = await service.deletePlayer(id);

    if (result.n === 0) {
      return res.status(404).json({ error: 'Player does not exist' });
    }

    res.status(200).json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
}
