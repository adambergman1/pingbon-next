import Head from 'next/head';

const Title = ({ title }) => {
  return (
    <Head>
      {!title ? <title>PingBon</title> : <title>{`${title} | PingBon`}</title>}
    </Head>
  );
};

export default Title;
