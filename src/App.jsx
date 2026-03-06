import { useState, useEffect } from 'react';
import BuildMode from './components/BuildMode';
import CountMode from './components/CountMode';
import ChangeMode from './components/ChangeMode';

const MODES = {
  build:  { label: 'Build the Amount', color: '#1565c0' },
  count:  { label: 'Count the Money',  color: '#6a1b9a' },
  change: { label: 'Make Change',       color: '#2e7d32' },
};

export default function App() {
  const [mode, setMode] = useState(null);

  if (!mode) return <HomeScreen onSelect={setMode} />;

  const { label, color } = MODES[mode];

  return (
    <div style={{
      maxWidth: 520,
      margin: '0 auto',
      padding: '12px 14px',
      fontFamily: "'Nunito', 'Segoe UI', Arial, sans-serif",
      minHeight: '100dvh',
      background: mode === 'change' ? '#f0f4f0' : '#f0f4ff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button
          onClick={() => setMode(null)}
          style={{
            background: 'white', border: '2px solid #90a4ae', borderRadius: 10,
            padding: '6px 12px', fontSize: 14, fontWeight: 'bold', color: '#546e7a',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← Menu
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 17, color }}>
          {label}
        </div>
      </div>

      {mode === 'build'  && <BuildMode />}
      {mode === 'count'  && <CountMode />}
      {mode === 'change' && <ChangeMode />}
    </div>
  );
}

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

function HomeScreen({ onSelect }) {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    if (isStandalone) return;
    const handler = e => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <div style={{
      maxWidth: 520,
      margin: '0 auto',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      fontFamily: "'Nunito', 'Segoe UI', Arial, sans-serif",
      background: 'linear-gradient(160deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e9 100%)',
      gap: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>💵</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: '#1a237e', margin: 0, letterSpacing: -0.5 }}>
          Cash Counter
        </h1>
        <p style={{ fontSize: 16, color: '#5c6bc0', margin: '8px 0 0', fontWeight: 600 }}>
          Learn to count US money!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 360 }}>
        <ModeCard
          emoji="🏗️"
          title="Build the Amount"
          desc="A number appears — use bills & coins to make it!"
          color="#1565c0"
          lightColor="#e3f2fd"
          onClick={() => onSelect('build')}
        />
        <ModeCard
          emoji="🔍"
          title="Count the Money"
          desc="Bills and coins are shown — what's the total?"
          color="#6a1b9a"
          lightColor="#f3e5f5"
          onClick={() => onSelect('count')}
        />
        <ModeCard
          emoji="🏪"
          title="Make Change"
          desc="Ring up a sale, take payment, give back the right change!"
          color="#2e7d32"
          lightColor="#e8f5e9"
          onClick={() => onSelect('change')}
        />
      </div>

      <p style={{ fontSize: 13, color: '#90a4ae', textAlign: 'center', maxWidth: 280 }}>
        Tap a game to start playing!
      </p>

      {installPrompt && (
        <button
          onClick={handleInstall}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '13px 24px',
            background: '#1b5e20',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "'Nunito', sans-serif",
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(27,94,32,0.35)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontSize: 20 }}>+</span>
          Add to Home Screen
        </button>
      )}
    </div>
  );
}

function ModeCard({ emoji, title, desc, color, lightColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'white',
        border: `3px solid ${color}`,
        borderRadius: 18,
        padding: '18px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: `0 4px 20px ${color}33`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s',
        width: '100%',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 13,
        background: lightColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, flexShrink: 0,
      }}>
        {emoji}
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#78909c', lineHeight: 1.4 }}>{desc}</div>
      </div>
    </button>
  );
}
