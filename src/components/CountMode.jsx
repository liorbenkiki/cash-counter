import { useState } from 'react';
import { generateCountCollection, formatMoney } from '../money';
import { BILLS, COINS } from '../money';
import Bill from './Bill';
import Coin from './Coin';
import ModeToggle from './ModeToggle';

function newRound(coinsOnly) {
  const { items, totalCents } = generateCountCollection(coinsOnly);
  return { items, totalCents, input: '', result: null };
}

export default function CountMode() {
  const [coinsOnly, setCoinsOnly] = useState(true);
  const [state, setState] = useState(() => newRound(true));

  const switchMode = (nextCoinsOnly) => {
    setCoinsOnly(nextCoinsOnly);
    setState(newRound(nextCoinsOnly));
  };

  const handleKeypad = (key) => {
    if (key === 'DEL') {
      setState(s => ({ ...s, input: s.input.slice(0, -1), result: null }));
      return;
    }
    if (key === '.' && state.input.includes('.')) return;
    if (key === '.' && state.input === '') {
      setState(s => ({ ...s, input: '0.' }));
      return;
    }
    const next = state.input + key;
    if (next.split('.')[1]?.length > 2) return;
    setState(s => ({ ...s, input: next, result: null }));
  };

  const check = () => {
    const entered = Math.round(parseFloat(state.input || '0') * 100);
    if (Math.abs(entered - state.totalCents) < 0.5) {
      setState(s => ({ ...s, result: 'correct' }));
    } else {
      setState(s => ({ ...s, result: 'wrong' }));
    }
  };

  const next = () => setState(newRound(coinsOnly));

  const billItems = state.items.filter(i => i.type === 'bill');
  const coinItems = state.items.filter(i => i.type === 'coin');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, paddingBottom:16 }}>
      {/* Mode toggle */}
      <ModeToggle coinsOnly={coinsOnly} onChange={switchMode} />

      {/* Instruction */}
      <div style={{
        background: 'linear-gradient(135deg, #4a148c, #6a1b9a)',
        borderRadius: 16,
        padding: '14px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(74,20,140,0.3)',
      }}>
        <div style={{ color:'#ce93d8', fontSize:14, fontWeight:600, letterSpacing:1 }}>HOW MUCH MONEY IS SHOWN?</div>
        <div style={{ color:'#f3e5f5', fontSize:13, marginTop:4 }}>
          Count all the {coinsOnly ? 'coins' : 'bills and coins'}, then type the total
        </div>
      </div>

      {/* Collection display */}
      <div style={{
        background: '#fafafa',
        border: '2px solid #e0e0e0',
        borderRadius: 14,
        padding: 16,
        minHeight: 120,
      }}>
        {billItems.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize:11, color:'#90a4ae', fontWeight:600, marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 }}>Bills</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
              {billItems.map(item => {
                const denom = BILLS.find(b => b.id === item.id) || item;
                return <Bill key={item.uid} denom={denom} onClick={() => {}} />;
              })}
            </div>
          </div>
        )}
        {coinItems.length > 0 && (
          <div>
            <div style={{ fontSize:11, color:'#90a4ae', fontWeight:600, marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 }}>Coins</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', alignItems:'center' }}>
              {coinItems.map(item => {
                const denom = COINS.find(c => c.id === item.id) || item;
                return <Coin key={item.uid} denom={denom} onClick={() => {}} />;
              })}
            </div>
          </div>
        )}
        {state.result === 'correct' && (
          <div style={{ marginTop:10, textAlign:'center', color:'#2e7d32', fontWeight:'bold', fontSize:16 }}>
            Total: {formatMoney(state.totalCents)}
          </div>
        )}
      </div>

      {/* Result banner */}
      {state.result && (
        <div style={{
          borderRadius: 12,
          padding: '12px 16px',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          background: state.result === 'correct' ? '#e8f5e9' : '#fff3e0',
          color: state.result === 'correct' ? '#2e7d32' : '#e65100',
          border: `2px solid ${state.result === 'correct' ? '#4caf50' : '#ff9800'}`,
        }}>
          {state.result === 'correct'
            ? `Great job! The answer is ${formatMoney(state.totalCents)}`
            : `Not quite! Try counting again.`}
        </div>
      )}

      {/* Answer input display */}
      <div style={{
        background: 'white',
        border: '2.5px solid #1565c0',
        borderRadius: 12,
        padding: '12px 16px',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#1a237e',
        minHeight: 58,
        letterSpacing: 2,
      }}>
        {state.input ? `$${state.input}` : <span style={{ color:'#b0bec5' }}>$0.00</span>}
      </div>

      {/* Keypad */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {['1','2','3','4','5','6','7','8','9','.','0','DEL'].map(k => (
          <button
            key={k}
            onClick={() => handleKeypad(k)}
            style={{
              padding: '16px 0',
              fontSize: k === 'DEL' ? 14 : 22,
              fontWeight: 'bold',
              background: k === 'DEL' ? '#ffebee' : 'white',
              color: k === 'DEL' ? '#c62828' : '#1a237e',
              border: `2px solid ${k === 'DEL' ? '#ef9a9a' : '#90caf9'}`,
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:12, marginTop:4 }}>
        {state.result !== 'correct' && (
          <button onClick={check} disabled={!state.input} style={{
            ...btnStyle('#6a1b9a', 'white'),
            opacity: state.input ? 1 : 0.5,
          }}>
            Check Answer
          </button>
        )}
        <button onClick={next} style={btnStyle(state.result === 'correct' ? '#2e7d32' : '#546e7a', 'white')}>
          {state.result === 'correct' ? 'Next Round!' : 'New Collection'}
        </button>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    flex: 1,
    padding: '14px 0',
    fontSize: 16,
    fontWeight: 'bold',
    background: bg,
    color,
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
    WebkitTapHighlightColor: 'transparent',
  };
}
