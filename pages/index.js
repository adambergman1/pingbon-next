import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import ReportMatch from '../components/ReportMatch';
import { editPlayer } from '../lib/api/players';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default () => {
  const { data, error } = useSWR('/api/players', fetcher);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (data?.length) {
      setPlayers([...data].sort((a, b) => (a.rating > b.rating ? -1 : 1)));
    }
  }, [data]);

  const handleReportMatch = async ({ winner, loser }) => {
    try {
      await editPlayer(winner._id, winner);
      await editPlayer(loser._id, loser);
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
      <Head>
        <title>PingBon</title>
      </Head>
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
                      <span className={styles.player_name}>{player.name}</span>
                      <span>Rating: {player.rating}</span>
                      <span className={styles.player_position}>
                        {index + 1}
                      </span>
                    </div>
                  ))}
              </div>
              <Link href='/leaderboard'>
                <a className='btn btn-dark'>View scoreboard</a>
              </Link>
            </>
          ) : (
            error && <p className='text-danger'>{error}</p>
          )}
        </div>
      </div>
    </>
  );
};
