import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Header.module.css';

const LINKS = [
  {
    path: '/',
    name: 'Dashboard',
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
  },
  {
    path: '/add-player',
    name: 'Add Player',
  },
];

const Header = () => {
  return (
    <header className='p-3 bg-dark'>
      <div className='container'>
        <nav className='navbar navbar-expand-lg navbar-dark'>
          <Link href='/'>
            <a className='navbar-brand logo'>BonPing</a>
          </Link>

          <ul className={`navbar-nav ms-md-auto ${styles.nav}`}>
            {LINKS.map((link) => (
              <li className='nav-item' key={link.name}>
                <Link href={link.path}>
                  <a className='nav-link'>{link.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
