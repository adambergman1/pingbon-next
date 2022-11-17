import React, { useEffect, useState } from 'react';
import _orderBy from 'lodash.orderby';
import PlayerListItem from '../components/PlayerListItem';
import * as service from '../services/players';
import * as api from '../lib/api/players';
import Title from '../components/Title';
import LadderPlayerItem from '../components/LadderPlayerItem';

export default (props) => {
  const [players, setPlayers] = useState([]);
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (props?.players?.length) {
      const sorted = _orderBy(props.players, (player) => player.ladderPosition, 'asc');
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

  const ArrowUp = () => <span>&#8593;</span>;
  const ArrowDown = () => <span>&#8595;</span>;

  return (
    <>
      <Title title='Leaderboard' />
      <div className='container py-5'>
        <div className='mb-5'>
          <h1>Ladder</h1>
          {sortedPlayers?.length ? <p>Showing {sortedPlayers.length} players in the ladder.</p> : <p>No players yet</p>}
                  You can challenge anyone 1-2 positions above you.
                  If you win, you trade position with the one you challenged.

          {sortedPlayers?.length && (
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead className='thead-light'>
                  <tr>
                    <th>
                        Position
                    </th>
                    <th>
                        Name
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedPlayers.map(player =>
                    <LadderPlayerItem
                        player={player}
                        key={player._id}
                    />
                  )}
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
