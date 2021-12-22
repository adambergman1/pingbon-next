import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

const ProgressBar = ({
  color = '#29D',
  height = 3,
  startPosition = 0.3,
  stopDelayMs = 200,
  showOnShallow = true,
  options = null,
}) => {
  let timer = null;

  const routeChangeStart = (_, { shallow }) => {
    if (!shallow || showOnShallow) {
      NProgress.set(startPosition);
      NProgress.start();
    }
  };

  const routeChangeEnd = (_, { shallow }) => {
    if (!shallow || showOnShallow) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.done(true);
      }, stopDelayMs);
    }
  };

  useEffect(() => {
    if (options) {
      NProgress.configure(options);
    }

    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeEnd);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeEnd);
      Router.events.off('routeChangeError', routeChangeEnd);
    };
  }, []);

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: ${color};
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: ${height}px;
      }
    `}</style>
  );
};

export default ProgressBar;
