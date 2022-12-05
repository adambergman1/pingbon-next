import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/Header.module.scss';
import { useRouter } from 'next/router';

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
  {
    path: '/ladder',
    name: 'Pingpong Ladder',
  },
];

const Header = () => {
  const router = useRouter();

  return (
    <header className='p-3 bg-dark'>
      <div className='container'>
        <nav className='navbar navbar-expand-lg navbar-dark'>
          <Link href='/'>
            <a className='navbar-brand logo'>
              <Image src='/pingpong.svg' width='18' height='18' />
              <span className='ms-2'>PingBon</span>
            </a>
          </Link>

          <ul className={`navbar-nav ms-md-auto ${styles.nav}`}>
            {LINKS.map((link) => (
              <li className='nav-item' key={link.name}>
                <Link href={link.path}>
                  <a
                    className={`nav-link ${
                      router.pathname === link.path ? 'active' : ''
                    }`}
                  >
                    {link.name}
                  </a>
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
