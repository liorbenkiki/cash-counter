export default function ModeToggle({ coinsOnly, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: '#dde3ea',
      borderRadius: 12,
      padding: 4,
      gap: 4,
    }}>
      <ToggleBtn
        active={!coinsOnly}
        onClick={() => onChange(false)}
        icon="💵🪙"
        label="All Money"
        activeColor="#1565c0"
      />
      <ToggleBtn
        active={coinsOnly}
        onClick={() => onChange(true)}
        icon="🪙"
        label="Coins Only"
        activeColor="#b45309"
      />
    </div>
  );
}

function ToggleBtn({ active, onClick, icon, label, activeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 0',
        borderRadius: 9,
        border: 'none',
        background: active ? activeColor : 'transparent',
        color: active ? 'white' : '#546e7a',
        fontWeight: 800,
        fontSize: 14,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        transition: 'background 0.15s, color 0.15s',
        boxShadow: active ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}
