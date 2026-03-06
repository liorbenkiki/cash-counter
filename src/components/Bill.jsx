export default function Bill({ denom, onClick, count, small, fluid }) {
  // Real US bills are 2.35:1 aspect ratio
  const W = small ? 120 : 176;
  const H = Math.round(W / 2.35);

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: fluid ? '100%' : W,
        height: fluid ? 'auto' : H,
        aspectRatio: fluid ? '2.35 / 1' : undefined,
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        borderRadius: 6,
        overflow: 'hidden',
        transition: 'transform 0.1s',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: '2px 3px 10px rgba(0,0,0,0.35)',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Real bill photo */}
      <img
        src={denom.img}
        alt={`${denom.label} bill`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
        draggable={false}
      />

      {/* Denomination label badge — always visible for kids */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.45)',
        color: '#fff',
        textAlign: 'center',
        fontSize: small ? 13 : fluid ? 'clamp(13px, 3vw, 17px)' : 17,
        fontWeight: 900,
        fontFamily: "'Nunito', sans-serif",
        padding: small ? '1px 0' : '2px 0',
        letterSpacing: 0.5,
        pointerEvents: 'none',
      }}>
        {denom.label}
      </div>

      {/* Count badge */}
      {count > 0 && (
        <div style={{
          position: 'absolute',
          top: -8,
          right: -8,
          background: '#e53935',
          color: 'white',
          borderRadius: '50%',
          width: 22,
          height: 22,
          fontSize: 12,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {count}
        </div>
      )}
    </button>
  );
}
