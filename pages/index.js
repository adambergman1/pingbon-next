import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.scss';
import ReportMatch from '../components/ReportMatch';
import * as service from '../services/players';
import * as api from '../lib/api/players';
import Title from '../components/Title';

export default (props) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (props?.players?.length) {
      setPlayers(
        [...props.players].sort((a, b) => (a.rating > b.rating ? -1 : 1))
      );
    }
  }, [props]);

  const handleReportMatch = async ({ winner, loser }) => {
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
              />
            </div>
          </div>
        )}

        <div className='mb-5'>
          <h2>Scoreboard</h2>
          {players?.length ? (
            <>
              <p>Listing top 10 players</p>
              <div className={`${styles.grid} mb-4`}>
                {players?.length &&
                  players.slice(0, 10).map((player, index) => (
                    <div className={styles.player} key={index}>
                      <span className={styles.name}>{player.name}</span>
                      <span>Rating: {player.rating}</span>
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
