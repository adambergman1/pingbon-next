import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUpdatedRatings } from '../lib/elo';
import { trimDecimals } from '../lib/helpers';
import Loading from './Loading';

const ReportLadderMatch = ({ players, onReportedMatch, loading }) => {
  const [challenger, setChallenger] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [challengerOptions, setChallengerOptions] = useState([]);
  const [opponentOptions, setOpponentOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [challenger, opponent]);

  useEffect(() => {
    setChallengerOptions(
      [...players]
        .sort((a, b) => a.ladderPosition - b.ladderPosition)
        .filter((player) => (player.ladderPosition != 1))
        .map((player) => ({
          value: player._id,
          label: `(${player.ladderPosition}) ${player.name} `,
        })),
    );
  }, [players]);

  useEffect(() => {
    if (!challenger || !players.length) {
      return
    }
    const challengerPosition = players.find((player) => player._id === challenger.value).ladderPosition
    const maximumLadderPositions = 2
    setOpponentOptions(
      [...players]
        .sort((a, b) => a.ladderPosition - b.ladderPosition)
        .filter((player) => player.ladderPosition < challengerPosition && player.ladderPosition >= challengerPosition - maximumLadderPositions )
        .map((player) => ({
          value: player._id,
          label: `(${player.ladderPosition}) ${player.name} `,
        }))
    );
  }, [challenger]);

  const handleUpdateLadderPosition = async (e) => {
    e.preventDefault();

    const challengerPlayer = players.find((p) => p._id === challenger.value);
    const opponentPlayer = players.find((p) => p._id === opponent.value);

    const winnerPosition = challengerPlayer.ladderPosition < opponentPlayer.ladderPosition ? challengerPlayer.ladderPosition : opponentPlayer.ladderPosition
    const losingPosition = challengerPlayer.ladderPosition > opponentPlayer.ladderPosition ? challengerPlayer.ladderPosition : opponentPlayer.ladderPosition

    try {
      await onReportedMatch({
        winner: {
          ...challengerPlayer,
          rating: challengerPlayer.rating,
          numberOfPlayedMatches: challengerPlayer.numberOfPlayedMatches,
          ladderPosition: winnerPosition
        },
        loser: {
          ...opponentPlayer,
          rating: opponentPlayer.rating,
          numberOfPlayedMatches: opponentPlayer.numberOfPlayedMatches,
          ladderPosition: losingPosition,
        },
      });
      setChallenger(null);
      setOpponent(null);
    } catch (error) {
      console.log(error);
      setError('Failed to report match. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Update ladder</h2>
      <p>Challenged someone on the ladder? Enter the match here if you won.</p>

      <div className='d-md-flex mb-4 mb-md-3'>
        <div className='d-flex flex-column mb-3 mb-md-0 me-md-2 w-100'>
          <label>Challenger</label>
          <Select
            isClearable
            placeholder='Select a challenger'
            value={challenger}
            onChange={setChallenger}
            options={challengerOptions}
          />
        </div>

        <div className='d-flex flex-column w-100'>
          {
            challenger && (
              <>
                <label>Opponent</label>
                <Select
                  isClearable
                  placeholder='Select an opponent if you won'
                  value={opponent}
                  onChange={setOpponent}
                  options={opponentOptions}
                />
              </>
            )
          }
        </div>
      </div>

      <div className='d-flex align-items-center'>
        {error ? (
          <p className='text-danger'>{error}</p>
        ) : (
          challenger !== opponent &&
          challenger &&
          opponent && (
            <>
                <button
                  className='btn btn-secondary me-2'
                  onClick={handleUpdateLadderPosition}
                  disabled={loading}
                >
                  {!loading ? 'Update ladder' : <Loading light />}
                </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default ReportLadderMatch;
