import React, { useEffect, useState } from 'react';
import _orderBy from 'lodash.orderby';
import PlayerListItem from '../components/PlayerListItem';
import * as service from '../services/players';
import * as api from '../lib/api/players';
import Title from '../components/Title';

export default (props) => {
  const [players, setPlayers] = useState([]);
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [error, setError] = useState('');
  const [sortedBy, setSortedBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (props?.players?.length) {
      const sorted = _orderBy(props.players, (player) => player.rating, sortOrder);
      setPlayers(sorted);
    }
  }, [props]);

  useEffect(() => {
    setSortedPlayers(players);
  }, [players]);

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

  const sortBy = (key) => {
    const orderToSort = sortedBy === key ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc';
    const sorted = _orderBy(players, (player) => player[key], orderToSort);
    setSortedPlayers(sorted);
    setSortedBy(key);
    setSortOrder(orderToSort);
  };

  const SortButton = ({ sortKey }) => (
    <button
      className={`btn btn-link btn-sm ${sortedBy === sortKey ? 'active' : 't-dec-none'}`}
      onClick={() => sortBy(sortKey)}
    >
      {sortedBy === sortKey ? sortOrder === 'asc' ? <ArrowDown /> : <ArrowUp /> : <ArrowDown />}
    </button>
  );

  const ArrowUp = () => <span>&#8593;</span>;
  const ArrowDown = () => <span>&#8595;</span>;

  return (
    <>
      <Title title='Leaderboard' />
      <div className='container py-5'>
        <div className='mb-5'>
          <h1>Scoreboard</h1>
          {sortedPlayers?.length ? <p>Showing {sortedPlayers.length} player scores</p> : <p>No players yet</p>}

          {sortedPlayers?.length && (
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead className='thead-light'>
                  <tr>
                    <th>
                      Name <SortButton sortKey='name' />
                    </th>
                    <th>
                      Rating <SortButton sortKey='rating' />
                    </th>
                    <th>
                      Number of played matches <SortButton sortKey='numberOfPlayedMatches' />
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {sortedPlayers.map((player) => (
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
          {error || (props?.error && <p className='text-danger'>{error || props.error}</p>)}
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
