import React, { useEffect, useState } from 'react';
import PlayerListItem from '../components/PlayerListItem';
import * as service from '../services/players';
import * as api from '../lib/api/players';
import Title from '../components/Title';

export default (props) => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (props?.players?.length) {
      setPlayers(
        [...props.players].sort((a, b) => (a.rating > b.rating ? -1 : 1))
      );
    }
  }, [props]);

  const handleEdit = async (player) => {
    try {
      await api.editPlayer(player._id, player);
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
      await api.removePlayer(id);
      setPlayers(players.filter((p) => p._id !== id));
    } catch (error) {
      setError('Failed to remove player');
    }
  };

  return (
    <>
      <Title title='Leaderboard' />
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
            (props?.error && (
              <p className='text-danger'>{error || props.error}</p>
            ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const players = JSON.parse(JSON.stringify(await service.getAllPlayers()));
    return {
      props: {
        players,
      },
    };
  } catch (error) {
    return {
      props: {
        error,
      },
    };
  }
}
