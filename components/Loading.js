import styles from '../styles/Loading.module.scss';

const Loading = ({ center, light }) => {
  return (
    <div className={center ? 'd-flex justify-content-center' : 'd-flex'}>
      <span className={`${styles.loading} ${light && styles.light}`} />
    </div>
  );
};

export default Loading;
