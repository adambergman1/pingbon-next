import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUpdatedRatings } from '../lib/elo';
import { trimDecimals } from '../lib/helpers';
import Loading from './Loading';

const ReportLadderMatch = ({ players, onReportedMatch, loading }) => {
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [winner, loser]);

  useEffect(() => {
    setPlayerOptions(
      [...players]
        .sort((a, b) => a.ladderPosition - b.ladderPosition)
        .map((player) => ({
          value: player._id,
          label: `${player.name} (${trimDecimals(player.rating)})`,
        }))
    );
  }, [players]);

  const handleUpdateLadderPosition = async (e) => {
    e.preventDefault();

    const winningPlayer = players.find((p) => p._id === winner.value);
    const losingPlayer = players.find((p) => p._id === loser.value);

    const winnerPosition = winningPlayer.ladderPosition < losingPlayer.ladderPosition ? winningPlayer.ladderPosition : losingPlayer.ladderPosition
    const losingPosition = winningPlayer.ladderPosition > losingPlayer.ladderPosition ? winningPlayer.ladderPosition : losingPlayer.ladderPosition

    try {
      await onReportedMatch({
        winner: {
          ...winningPlayer,
          rating: winningPlayer.rating,
          numberOfPlayedMatches: winningPlayer.numberOfPlayedMatches,
          ladderPosition: 1,
        },
        loser: {
          ...losingPlayer,
          rating: losingPlayer.rating,
          numberOfPlayedMatches: losingPlayer.numberOfPlayedMatches,
          ladderPosition: 2,
        },
      });
    } catch (error) {
      console.log(error);
      setError('Failed to report match. Please try again later.');
    }
  };

  return (
    <div className=''>
      <h2>Update ladder</h2>
      <p>Challenged someone on the ladder? Enter the match here if you won.</p>

      <div className='d-md-flex mb-4 mb-md-3'>
        <div className='d-flex flex-column mb-3 mb-md-0 me-md-2 w-100'>
          <label>Challenger</label>
          <Select
            isClearable
            placeholder='Select a challenger'
            value={winner}
            onChange={setWinner}
            options={playerOptions}
          />
        </div>

        <div className='d-flex flex-column w-100'>
          <label>Loser</label>
          <Select
            isClearable
            placeholder='Select a loser if the challenger won'
            value={loser}
            onChange={setLoser}
            options={playerOptions}
          />
        </div>
      </div>

      <div className='d-flex align-items-center'>
        {error ? (
          <p className='text-danger'>{error}</p>
        ) : (
          winner !== loser &&
          winner &&
          loser && (
            <>
                <button
                  className='btn btn-secondary me-2'
                  onClick={handleUpdateLadderPosition}
                >
                  Update ladder positions
                </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default ReportLadderMatch;
