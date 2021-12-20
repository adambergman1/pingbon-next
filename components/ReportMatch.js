import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUpdatedRatings } from '../lib/elo';

const ReportMatch = ({ players, onReportedMatch }) => {
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [calculatedRating, setCalculatedRating] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setCalculatedRating(null);
    setError('');
  }, [winner, loser]);

  useEffect(() => {
    setPlayerOptions(
      [...players]
        .sort((a, b) => b.rating - a.rating)
        .map((player) => ({
          value: player._id,
          label: `${player.name} (${player.rating})`,
        }))
    );
  }, [players]);

  const handleUpdateScore = async (e) => {
    e.preventDefault();

    const winningPlayer = players.find((p) => p._id === winner.value);
    const losingPlayer = players.find((p) => p._id === loser.value);
    const { playerA, playerB } = getUpdatedRatings(winningPlayer, losingPlayer);

    try {
      await onReportedMatch({
        winner: {
          ...winningPlayer,
          rating: playerA,
          numberOfPlayedMatches: winningPlayer.numberOfPlayedMatches + 1,
        },
        loser: {
          ...losingPlayer,
          rating: playerB,
          numberOfPlayedMatches: losingPlayer.numberOfPlayedMatches + 1,
        },
      });
      setCalculatedRating(null);
      setWinner(null);
      setLoser(null);
    } catch (error) {
      console.log(error);
      setError('Failed to report match. Please try again later.');
    }
  };

  const handleCalculateRatings = () => {
    const winningPlayer = players.find((p) => p._id === winner.value);
    const losingPlayer = players.find((p) => p._id === loser.value);
    const futureRatings = getUpdatedRatings(winningPlayer, losingPlayer, false);

    setCalculatedRating({
      winner: {
        name: winningPlayer.name,
        currentRating: winningPlayer.rating,
        futureRating: futureRatings.playerA,
      },
      loser: {
        name: losingPlayer.name,
        currentRating: losingPlayer.rating,
        futureRating: futureRatings.playerB,
      },
    });
  };

  return (
    <div className=''>
      <h2>Update scores</h2>
      <p>Recently played a game? Enter the results of the match here.</p>

      <div className='d-md-flex mb-4 mb-md-3'>
        <div className='d-flex flex-column mb-3 mb-md-0 me-md-2 w-100'>
          <label>Winner</label>
          <Select
            isClearable
            placeholder='Select a winner'
            value={winner}
            onChange={setWinner}
            options={playerOptions}
          />
        </div>

        <div className='d-flex flex-column w-100'>
          <label>Loser</label>
          <Select
            isClearable
            placeholder='Select a loser'
            value={loser}
            onChange={setLoser}
            options={playerOptions}
          />
        </div>
      </div>

      {calculatedRating && (
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Current rating</th>
              <th>Future rating</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{calculatedRating.winner.name}</td>
              <td>{calculatedRating.winner.currentRating}</td>
              <td>{calculatedRating.winner.futureRating}</td>
            </tr>
            <tr>
              <td>{calculatedRating.loser.name}</td>
              <td>{calculatedRating.loser.currentRating}</td>
              <td>{calculatedRating.loser.futureRating}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div className='d-flex align-items-center'>
        {error ? (
          <p className='text-danger'>{error}</p>
        ) : (
          winner !== loser &&
          winner &&
          loser && (
            <>
              {!calculatedRating ? (
                <button
                  className='btn btn-secondary me-2'
                  onClick={handleCalculateRatings}
                >
                  Preview scores
                </button>
              ) : (
                <button
                  className='btn btn-primary me-2'
                  onClick={handleUpdateScore}
                >
                  Update scores
                </button>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default ReportMatch;
