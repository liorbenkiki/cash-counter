import { useState, useCallback } from 'react';
import { BILLS, COINS, formatMoney, formatCoins, randomTarget } from '../money';
import Bill from './Bill';
import Coin from './Coin';
import ModeToggle from './ModeToggle';

export default function BuildMode() {
  const [coinsOnly, setCoinsOnly] = useState(true);
  const [targetCents, setTargetCents] = useState(() => randomTarget(true));
  const [collection, setCollection] = useState([]);
  const [result, setResult] = useState(null);

  const totalCents = collection.reduce((s, i) => s + i.cents, 0);
  const remaining = targetCents - totalCents;

  const switchMode = (nextCoinsOnly) => {
    setCoinsOnly(nextCoinsOnly);
    setCollection([]);
    setResult(null);
    setTargetCents(randomTarget(nextCoinsOnly));
  };

  const addItem = useCallback((denom, type) => {
    if (result === 'correct') return;
    const cents = type === 'bill' ? denom.value * 100 : Math.round(denom.value * 100);
    setCollection(prev => [...prev, { ...denom, cents, type, uid: `${denom.id}-${Date.now()}-${Math.random()}` }]);
    setResult(null);
  }, [result]);

  const removeItem = useCallback((uid) => {
    setCollection(prev => prev.filter(i => i.uid !== uid));
    setResult(null);
  }, []);

  const check = () => {
    if (Math.abs(totalCents - targetCents) < 0.5) {
      setResult('correct');
    } else if (totalCents > targetCents) {
      setResult('over');
    } else {
      setResult('under');
    }
  };

  const reset = () => {
    setCollection([]);
    setResult(null);
    setTargetCents(randomTarget(coinsOnly));
  };

  const countOf = (id) => collection.filter(i => i.id === id).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, paddingBottom:16 }}>
      {/* Mode toggle */}
      <ModeToggle coinsOnly={coinsOnly} onChange={switchMode} />

      {/* Target */}
      <div style={{
        background: 'linear-gradient(135deg, #1a237e, #283593)',
        borderRadius: 16,
        padding: '16px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(26,35,126,0.3)',
      }}>
        <div style={{ color:'#90caf9', fontSize:14, fontWeight:600, letterSpacing:1, marginBottom:4 }}>
          MAKE THIS AMOUNT
        </div>
        <div style={{ color:'white', fontSize:48, fontWeight:'bold', fontFamily:'monospace', lineHeight:1 }}>
          {coinsOnly ? formatCoins(targetCents) : formatMoney(targetCents)}
        </div>
        <div style={{ color:'#64b5f6', fontSize:13, marginTop:6 }}>
          {remaining > 0
            ? `${coinsOnly ? formatCoins(remaining) : formatMoney(remaining)} more to go`
            : remaining < 0
            ? `${coinsOnly ? formatCoins(-remaining) : formatMoney(-remaining)} too much!`
            : "That's exactly right!"}
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div style={{
          borderRadius: 12,
          padding: '12px 16px',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          background: result === 'correct' ? '#e8f5e9' : '#ffebee',
          color: result === 'correct' ? '#2e7d32' : '#c62828',
          border: `2px solid ${result === 'correct' ? '#4caf50' : '#ef5350'}`,
          animation: 'pop 0.2s ease',
        }}>
          {result === 'correct' && '🎉 Perfect! You did it!'}
          {result === 'over' && `Too much! You have ${coinsOnly ? formatCoins(totalCents - targetCents) : formatMoney(totalCents - targetCents)} extra.`}
          {result === 'under' && `Not quite! You still need ${coinsOnly ? formatCoins(remaining) : formatMoney(remaining)}.`}
        </div>
      )}

      {/* Collection area */}
      <div style={{
        border: '2.5px dashed #90a4ae',
        borderRadius: 14,
        minHeight: 100,
        padding: 12,
        background: '#f5f7fa',
      }}>
        <div style={{ fontSize:12, color:'#78909c', marginBottom:8, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>
          Your collection — tap to remove
        </div>
        {collection.length === 0
          ? <div style={{ color:'#b0bec5', textAlign:'center', paddingTop:16, fontSize:14 }}>
              Tap {coinsOnly ? 'coins' : 'bills & coins'} below to add them here
            </div>
          : (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
              {collection.map(item => (
                item.type === 'bill'
                  ? <Bill key={item.uid} denom={item} onClick={() => removeItem(item.uid)} small />
                  : <Coin key={item.uid} denom={item} onClick={() => removeItem(item.uid)} small />
              ))}
            </div>
          )}
        {collection.length > 0 && (
          <div style={{ marginTop:10, fontSize:15, fontWeight:'bold', color:'#37474f', textAlign:'right' }}>
            Total: {coinsOnly ? formatCoins(totalCents) : formatMoney(totalCents)}
          </div>
        )}
      </div>

      {/* Bills row — hidden in coins-only mode */}
      {!coinsOnly && (
        <div>
          <div style={{ fontSize:12, color:'#546e7a', fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Bills — tap to add</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:10 }}>
            {BILLS.map(b => (
              <Bill key={b.id} denom={b} onClick={() => addItem(b, 'bill')} count={countOf(b.id)} fluid />
            ))}
          </div>
        </div>
      )}

      {/* Coins row */}
      <div>
        <div style={{ fontSize:12, color:'#546e7a', fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Coins — tap to add</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', alignItems:'center' }}>
          {COINS.map(c => (
            <Coin key={c.id} denom={c} onClick={() => addItem(c, 'coin')} count={countOf(c.id)} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:12, marginTop:4 }}>
        {result !== 'correct' && (
          <button onClick={check} style={btnStyle('#1565c0', 'white')}>
            Check My Answer
          </button>
        )}
        <button onClick={reset} style={btnStyle(result === 'correct' ? '#2e7d32' : '#546e7a', 'white')}>
          {result === 'correct' ? 'Next Challenge!' : 'Start Over'}
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
