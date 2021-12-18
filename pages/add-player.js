import React, { useState } from 'react';
import Head from 'next/head';
import { addPlayer } from '../lib/api/players';

export default () => {
  const [name, setName] = useState('');
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAdded(false);
    setError('');
    setName(e.target.value);
  };

  const handleAddPlayer = async () => {
    if (name.length < 3) {
      setError('Name is too short. Use at least 3 characters.');
    } else if (name.length > 100) {
      setError('Name is too long. Use less than 100 characters.');
    } else {
      try {
        await addPlayer(name);
        setAdded(true);
      } catch (error) {
        setError(error?.response?.data?.error || error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Add Player - PingBon</title>
      </Head>
      <div className='container my-5'>
        <div className='row'>
          <div className='col-md-4'>
            <h1>Add new Player</h1>
            <p>Everyone is free to join!</p>
            <label>Enter the player's full name (must be unique)</label>
            <div className='input-group mb-3'>
              <input
                type='text'
                className='form-control'
                placeholder='John Doe'
                value={name}
                onChange={handleChange}
              />
              <div className='input-group-append'>
                <button
                  disabled={!name}
                  className='btn btn-primary'
                  onClick={handleAddPlayer}
                >
                  Add Player
                </button>
              </div>
            </div>

            {added ? (
              <p className='fw-bold'>Successfully added {name} to BonPing!</p>
            ) : (
              error && <p className='text-danger'>{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
