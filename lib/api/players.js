import axios from 'axios';

export const getAllPlayers = () => axios.get('/api/players');

export const addPlayer = (name) => axios.post('/api/players', { name });

export const removePlayer = (id) => axios.delete(`/api/players/${id}`);

export const editPlayer = (id, values) =>
  axios.patch(`/api/players/${id}`, values);
