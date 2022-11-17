import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.scss';
import ReportMatch from '../components/ReportMatch';
import ReportLadderMatch from '../components/ReportLadderMatch';
import * as service from '../services/players';
import * as api from '../lib/api/players';
import Title from '../components/Title';
import { trimDecimals } from '../lib/helpers';

export default (props) => {
  const [players, setPlayers] = useState([]);
  const [isReportingMatch, setIsReportingMatch] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    if (props?.players?.length) {
      setPlayers(
        [...props.players].sort((a, b) => (a.rating > b.rating ? -1 : 1))
      );
    }
  }, [props]);

  useEffect(() => {
    const topFive = players.filter(player => player.numberOfPlayedMatches > 0).slice(0, 5);
    setTopPlayers(topFive);
  }, [players])

  const handleReportMatch = async ({ winner, loser }) => {
    setIsReportingMatch(true);

    try {
      await api.editPlayer(winner._id, winner);
      await api.editPlayer(loser._id, loser);
      const updatedPlayers = [...players];
      const winnerIndex = updatedPlayers.findIndex((p) => p._id === winner._id);
      const loserIndex = updatedPlayers.findIndex((p) => p._id === loser._id);
      updatedPlayers[winnerIndex] = winner;
      updatedPlayers[loserIndex] = loser;
      setPlayers(updatedPlayers);
    } catch (error) {
      console.log(error);
      throw Error(error);
    }

    setIsReportingMatch(false);
  };

  return (
    <>
      <Title />
      <div className='container py-5'>
        {players?.length && (
          <div className='row'>
            <div className='mb-5 col-md-6'>
              <ReportMatch
                players={players}
                onReportedMatch={handleReportMatch}
                loading={isReportingMatch}
              />
            </div>
          </div>
        )}

        {players?.length && (
          <div className='row'>
            <div className='mb-5 col-md-6'>
              <ReportLadderMatch
                players={players}
                onReportedMatch={handleReportMatch}
                loading={isReportingMatch}
              />
            </div>
          </div>
        )}

        <div className='mb-5'>
          <h2>Scoreboard</h2>
          {topPlayers?.length ? (
            <>
              <p>Listing top { topPlayers.length } players</p>
              <div className={`${styles.grid} mb-4`}>
                {topPlayers.map((player, index) => (
                    <div className={styles.player} key={index}>
                      <span className={styles.name}>{player.name}</span>
                      <span>Rating: {trimDecimals(player.rating)}</span>
                      <span className={styles.position}>{index + 1}</span>
                    </div>
                  ))}
              </div>
              <Link href='/leaderboard'>
                <a className='btn btn-dark'>View scoreboard</a>
              </Link>
            </>
          ) : (
            props?.error && <p className='text-danger'>{props.error}</p>
          )}
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
