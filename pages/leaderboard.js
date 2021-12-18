import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import PlayerListItem from '../components/PlayerListItem';
import { editPlayer, removePlayer } from '../lib/api/players';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default () => {
  const { data, error: fetchError } = useSWR('/api/players', fetcher);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data?.length) {
      setPlayers([...data].sort((a, b) => (a.rating > b.rating ? -1 : 1)));
    }
  }, [data]);

  const handleEdit = async (player) => {
    try {
      await editPlayer(player._id, player);
      const updatedPlayers = [...players];
      const index = updatedPlayers.findIndex((p) => p._id === player._id);
      updatedPlayers[index] = player;
      setPlayers(updatedPlayers);
    } catch (error) {
      setError(`Failed to update player ${player.name}`);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removePlayer(id);
      setPlayers(players.filter((p) => p._id !== id));
    } catch (error) {
      setError('Failed to remove player');
    }
  };

  return (
    <>
      <Head>
        <title>Leaderboard - PingBon</title>
      </Head>
      <div className='container py-5'>
        <div className='mb-5'>
          <h1>Scoreboard</h1>
          {players?.length ? (
            <p>Showing {players.length} player scores</p>
          ) : (
            <p>No players yet</p>
          )}

          {players?.length && (
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead className='thead-light'>
                  <tr>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Number of played matches</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((player) => (
                    <PlayerListItem
                      player={player}
                      onEdit={handleEdit}
                      onRemove={() => handleRemove(player._id)}
                      key={player._id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {error ||
            (fetchError && (
              <p className='text-danger'>{error || fetchError}</p>
            ))}
        </div>
      </div>
    </>
  );
};
