import { useState } from 'react';
import { BILLS, COINS, formatMoney, generateChangeScenario } from '../money';
import Bill from './Bill';
import Coin from './Coin';

// Only bills a register drawer would hold for making change
const DRAWER_BILLS = BILLS.filter(b => ['b1', 'b5', 'b10', 'b20'].includes(b.id));
const DRAWER_COINS = COINS; // quarter, dime, nickel, penny

function newScenario() {
  return { ...generateChangeScenario(), dispensed: [], result: null };
}

export default function ChangeMode() {
  const [state, setState] = useState(() => newScenario());

  const dispensedTotal = state.dispensed.reduce((s, i) => s + i.cents, 0);
  const remaining = state.changeCents - dispensedTotal;

  const dispense = (denom, type) => {
    if (state.result === 'correct') return;
    const cents = type === 'bill' ? denom.value * 100 : Math.round(denom.value * 100);
    setState(s => ({
      ...s,
      dispensed: [...s.dispensed, { ...denom, cents, type, uid: `${denom.id}-${Date.now()}-${Math.random()}` }],
      result: null,
    }));
  };

  const returnItem = uid => {
    setState(s => ({ ...s, dispensed: s.dispensed.filter(i => i.uid !== uid), result: null }));
  };

  const check = () => {
    if (Math.abs(dispensedTotal - state.changeCents) < 0.5) {
      setState(s => ({ ...s, result: 'correct' }));
    } else if (dispensedTotal > state.changeCents) {
      setState(s => ({ ...s, result: 'over' }));
    } else {
      setState(s => ({ ...s, result: 'under' }));
    }
  };

  const reset = () => setState(newScenario());

  const paymentBills = state.paymentBillIds.map((id, i) => ({
    ...BILLS.find(b => b.id === id),
    uid: id + '-pay-' + i,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>

      {/* ── Register Display ── */}
      <div style={{
        background: '#0d0d0d',
        borderRadius: 14,
        border: '3px solid #333',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        {/* Machine top strip */}
        <div style={{
          background: 'linear-gradient(180deg, #2a2a2a, #1a1a1a)',
          padding: '6px 14px 4px',
          fontSize: 10,
          fontWeight: 700,
          color: '#555',
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          borderBottom: '1px solid #222',
        }}>
          Cash Register
        </div>

        {/* LCD screen */}
        <div style={{
          background: '#0a1a0a',
          padding: '14px 16px 10px',
          fontFamily: "'Courier New', Courier, monospace",
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <LcdRow label="SALE" value={formatMoney(state.purchaseCents)} dim />
          <LcdRow label="PAID" value={formatMoney(state.paymentCents)} bright />
          {state.result === 'correct' && <>
            <div style={{ borderTop: '1px solid #1a3a1a', margin: '2px 0' }} />
            <LcdRow label="CHANGE" value={formatMoney(state.changeCents)} bright />
          </>}
        </div>
      </div>

      {/* ── Customer paid with ── */}
      <Section label="Customer paid with:">
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {paymentBills.map(b => (
            <Bill key={b.uid} denom={b} onClick={() => {}} />
          ))}
        </div>
      </Section>

      {/* ── Result banner ── */}
      {state.result && (
        <div style={{
          borderRadius: 12,
          padding: '12px 16px',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          background: state.result === 'correct' ? '#e8f5e9' : '#ffebee',
          color: state.result === 'correct' ? '#2e7d32' : '#c62828',
          border: `2px solid ${state.result === 'correct' ? '#4caf50' : '#ef5350'}`,
          animation: 'pop 0.2s ease',
        }}>
          {state.result === 'correct' && '🎉 Correct change! Great job!'}
          {state.result === 'over' && `Too much! You gave ${formatMoney(dispensedTotal - state.changeCents)} extra.`}
          {state.result === 'under' && `Not enough! Still need ${formatMoney(remaining)}.`}
        </div>
      )}

      {/* ── Change tray ── */}
      <Section label="Change tray — tap to return">
        <div style={{
          minHeight: 72,
          background: '#e8f5e8',
          borderRadius: 10,
          border: '2px dashed #81c784',
          padding: 8,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          alignItems: 'center',
        }}>
          {state.dispensed.length === 0
            ? <span style={{ color: '#a5d6a7', fontSize: 13, margin: 'auto' }}>
                Tap bills &amp; coins in the drawer below
              </span>
            : state.dispensed.map(item =>
                item.type === 'bill'
                  ? <Bill key={item.uid} denom={item} onClick={() => returnItem(item.uid)} small />
                  : <Coin key={item.uid} denom={item} onClick={() => returnItem(item.uid)} small />
              )
          }
        </div>
        {state.dispensed.length > 0 && (
          <div style={{ textAlign: 'right', fontSize: 13, color: '#546e7a', fontWeight: 700, marginTop: 4 }}>
            {formatMoney(dispensedTotal)} in tray
          </div>
        )}
      </Section>

      {/* ── Cash Register Drawer ── */}
      <div style={{
        background: '#181818',
        borderRadius: 14,
        border: '3px solid #3a3a3a',
        overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.5), inset 0 2px 8px rgba(0,0,0,0.6)',
      }}>
        {/* Drawer label */}
        <div style={{
          background: 'linear-gradient(180deg, #2e2e2e, #222)',
          padding: '5px 14px',
          fontSize: 10,
          fontWeight: 700,
          color: '#666',
          letterSpacing: 2,
          fontFamily: 'monospace',
          borderBottom: '2px solid #111',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>CASH DRAWER</span>
          <span style={{ color: '#444' }}>TAP TO DISPENSE</span>
        </div>

        <div style={{ padding: '10px 8px 12px' }}>
          {/* Bill compartments */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 6,
            marginBottom: 8,
          }}>
            {DRAWER_BILLS.map(b => (
              <DrawerSlot key={b.id} onClick={() => dispense(b, 'bill')}>
                <Bill denom={b} onClick={() => {}} small />
              </DrawerSlot>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#333', margin: '0 4px 8px' }} />

          {/* Coin compartments */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 6,
          }}>
            {DRAWER_COINS.map(c => (
              <DrawerSlot key={c.id} onClick={() => dispense(c, 'coin')} round>
                <Coin denom={c} onClick={() => {}} small />
              </DrawerSlot>
            ))}
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        {state.result !== 'correct' && (
          <button
            onClick={check}
            disabled={state.dispensed.length === 0}
            style={{ ...btnStyle('#2e7d32', 'white'), opacity: state.dispensed.length ? 1 : 0.45 }}
          >
            Give Change
          </button>
        )}
        <button onClick={reset} style={btnStyle(state.result === 'correct' ? '#1565c0' : '#546e7a', 'white')}>
          {state.result === 'correct' ? 'Next Customer!' : 'New Sale'}
        </button>
      </div>
    </div>
  );
}

// LCD display row
function LcdRow({ label, value, bright, dim }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.5,
        color: bright ? '#4a9a4a' : '#2a5a2a',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: bright ? 28 : 18,
        fontWeight: 700,
        color: bright ? '#5dfc5d' : '#2e7a2e',
        textShadow: bright ? '0 0 12px #00ff0066' : 'none',
        letterSpacing: 1,
      }}>
        {value}
      </span>
    </div>
  );
}

// Labeled section wrapper
function Section({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#78909c', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// Drawer slot — wraps a bill or coin button inside a dark compartment
function DrawerSlot({ children, onClick, round }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#111',
        border: '1.5px solid #3a3a3a',
        borderRadius: round ? '50%' : 8,
        padding: round ? 0 : '4px 2px 6px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)',
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s, background 0.1s',
        aspectRatio: round ? '1' : 'auto',
        minHeight: round ? 60 : 52,
        overflow: 'hidden',
        position: 'relative',
      }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.94)'; e.currentTarget.style.background = '#1e1e1e'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#111'; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.94)'; e.currentTarget.style.background = '#1e1e1e'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#111'; }}
    >
      {/* Render the child bill/coin but intercept clicks at slot level */}
      <div style={{ pointerEvents: 'none' }}>
        {children}
      </div>
    </button>
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
    fontFamily: "'Nunito', sans-serif",
  };
}
