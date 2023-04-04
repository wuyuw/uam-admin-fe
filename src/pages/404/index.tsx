import img404 from '@/assets/404.png';

export default () => {
  return (
    <div style={{ padding: 64 }}>
      <div
        style={{
          minWidth: 428,
          maxWidth: 680,
          margin: '0 auto',
        }}
      >
        <img src={img404} style={{ width: '100%' }} />
      </div>
    </div>
  );
};
