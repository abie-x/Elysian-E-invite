import { useEffect, useMemo, useState } from 'react';
import { getGuests } from '../api';

export default function Mosaic() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      setError('');
      setLoading(true);
      try {
        const data = await getGuests();
        if (!ignore) setGuests(data || []);
      } catch (err) {
        if (!ignore) setError(err?.message || 'Failed to load guests');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const { rows, cols } = useMemo(() => {
    const n = Math.max(guests.length, 1);
    const c = Math.ceil(Math.sqrt(n));
    const r = Math.ceil(n / c);
    return { rows: r, cols: c };
  }, [guests.length]);

  function tileStyle(index) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = cols > 1 ? (col / (cols - 1)) * 100 : 0;
    const y = rows > 1 ? (row / (rows - 1)) * 100 : 0;
    return {
      backgroundImage: "url('/wed.jpg')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${x}% ${y}%`,
    };
  }

  return (
    <div className="h-screen w-screen bg-black">
      <div className="absolute top-3 left-3 z-10">
        <button
          type="button"
          onClick={() => { window.location.reload(); }}
          className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-white/20"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 grid place-items-center text-white/70">Loading…</div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center text-red-400">{error}</div>
      )}

      <div
        className="grid h-full w-full gap-[2px] md:gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {guests.map((g, i) => {
          const revealed = Boolean(g.checkedIn);
          return (
            <div
              key={g.qrId || i}
              className={`relative overflow-hidden rounded-sm ring-1 ring-white/10 transition-all duration-700 ${revealed ? '' : 'grayscale opacity-40 blur-md'} `}
              style={tileStyle(i)}
            >
              <div className="absolute inset-0" />
            </div>
          );
        })}
        {/* Fill remaining tiles if any to complete the grid */}
        {Array.from({ length: rows * cols - guests.length }).map((_, k) => {
          const i = guests.length + k;
          return (
            <div
              key={`empty-${i}`}
              className="relative overflow-hidden rounded-sm ring-1 ring-white/10 grayscale opacity-40 blur-md"
              style={tileStyle(i)}
            />
          );
        })}
      </div>
    </div>
  );
}


