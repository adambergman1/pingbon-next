import React from 'react';

const Footer = () => {
  return (
    <footer className='footer p-3'>
      <div className='container'>
        <p className='text-secondary'>
          © Bontouch AB {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
