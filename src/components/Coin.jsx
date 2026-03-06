export default function Coin({ denom, onClick, count, small }) {
  const size = small ? Math.round(denom.size * 0.72) : denom.size;

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: size,
        height: size,
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        transition: 'transform 0.1s',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: '1px 2px 8px rgba(0,0,0,0.35)',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Real coin photo */}
      <img
        src={denom.img}
        alt={`${denom.sublabel} coin`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
        draggable={false}
      />

      {/* Label overlay at bottom — for readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: denom.labelBg,
        color: denom.labelColor,
        textAlign: 'center',
        fontSize: small ? 9 : Math.max(10, size * 0.175),
        fontWeight: 900,
        fontFamily: "'Nunito', sans-serif",
        lineHeight: 1.3,
        padding: '1px 0 2px',
        pointerEvents: 'none',
      }}>
        {denom.label}
        {!small && (
          <div style={{ fontSize: size * 0.12, fontWeight: 600, opacity: 0.9 }}>
            {denom.sublabel}
          </div>
        )}
      </div>

      {/* Count badge */}
      {count > 0 && (
        <div style={{
          position: 'absolute',
          top: -6,
          right: -6,
          background: '#e53935',
          color: 'white',
          borderRadius: '50%',
          width: 18,
          height: 18,
          fontSize: 10,
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
