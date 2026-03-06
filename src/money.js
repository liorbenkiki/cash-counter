const base = import.meta.env.BASE_URL;

export const BILLS = [
  { id: 'b100', value: 100, label: '$100', img: `${base}money/bills/100.jpg`, labelBg: '#1a4d2e' },
  { id: 'b50',  value: 50,  label: '$50',  img: `${base}money/bills/50.jpg`,  labelBg: '#1a4d2e' },
  { id: 'b20',  value: 20,  label: '$20',  img: `${base}money/bills/20.jpg`,  labelBg: '#1a4d2e' },
  { id: 'b10',  value: 10,  label: '$10',  img: `${base}money/bills/10.jpg`,  labelBg: '#1a4d2e' },
  { id: 'b5',   value: 5,   label: '$5',   img: `${base}money/bills/5.jpg`,   labelBg: '#1a4d2e' },
  { id: 'b1',   value: 1,   label: '$1',   img: `${base}money/bills/1.jpg`,   labelBg: '#1a4d2e' },
];

export const COINS = [
  { id: 'c25', value: 0.25, label: '25¢', sublabel: 'Quarter', img: `${base}money/coins/quarter.jpg`, size: 70, labelColor: '#fff', labelBg: 'rgba(0,0,0,0.55)' },
  { id: 'c10', value: 0.10, label: '10¢', sublabel: 'Dime',    img: `${base}money/coins/dime.jpg`,    size: 56, labelColor: '#fff', labelBg: 'rgba(0,0,0,0.55)' },
  { id: 'c5',  value: 0.05, label: '5¢',  sublabel: 'Nickel',  img: `${base}money/coins/nickel.jpg`,  size: 64, labelColor: '#fff', labelBg: 'rgba(0,0,0,0.55)' },
  { id: 'c1',  value: 0.01, label: '1¢',  sublabel: 'Penny',   img: `${base}money/coins/penny.png`,   size: 60, labelColor: '#fff', labelBg: 'rgba(80,30,0,0.65)' },
];

export function formatMoney(cents) {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function generateChangeScenario() {
  // Purchase: $5–$49 with realistic cent endings
  const dollars = Math.floor(Math.random() * 45) + 5; // 5–49
  const centOptions = [0, 25, 49, 50, 75, 99];
  const cents = centOptions[Math.floor(Math.random() * centOptions.length)];
  const purchaseCents = dollars * 100 + cents;

  // Always use the smallest payment that covers the purchase
  let chosen;
  if (purchaseCents < 2000)      chosen = { paymentCents: 2000, billIds: ['b20'] };
  else if (purchaseCents < 4000) chosen = { paymentCents: 4000, billIds: ['b20', 'b20'] };
  else                           chosen = { paymentCents: 5000, billIds: ['b50'] };

  return {
    purchaseCents,
    paymentCents: chosen.paymentCents,
    changeCents: chosen.paymentCents - purchaseCents,
    paymentBillIds: chosen.billIds,
  };
}

export function randomTarget(coinsOnly = false) {
  const max = coinsOnly ? 100 : 12000;
  return Math.floor(Math.random() * max) + 1;
}

export function generateCountCollection(coinsOnly = false) {
  const allDenoms = coinsOnly
    ? COINS.map(c => ({ ...c, cents: Math.round(c.value * 100), type: 'coin' }))
    : [
        ...BILLS.map(b => ({ ...b, cents: b.value * 100, type: 'bill' })),
        ...COINS.map(c => ({ ...c, cents: Math.round(c.value * 100), type: 'coin' })),
      ];
  const maxCents = coinsOnly ? 100 : 12000;
  const items = [];
  let totalCents = 0;
  const count = Math.floor(Math.random() * 7) + 2;
  for (let i = 0; i < count; i++) {
    const affordable = allDenoms.filter(d => totalCents + d.cents <= maxCents);
    if (!affordable.length) break;
    const pick = affordable[Math.floor(Math.random() * affordable.length)];
    items.push({ ...pick, uid: `${pick.id}-${Date.now()}-${i}` });
    totalCents += pick.cents;
  }
  return { items, totalCents };
}
