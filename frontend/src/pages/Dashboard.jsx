import { useEffect, useMemo, useState } from 'react';
import { getGuests } from '../api';

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | checked | not
  const [copiedId, setCopiedId] = useState('');

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests
      .filter((g) =>
        (filter === 'all') || (filter === 'checked' ? g.checkedIn : !g.checkedIn)
      )
      .filter((g) => (q ? g.name.toLowerCase().includes(q) : true));
  }, [guests, query, filter]);

  async function copyToClipboard(text, id) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 1200);
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopiedId(id); setTimeout(() => setCopiedId(''), 1200);} catch(_) {}
      document.body.removeChild(ta);
    }
  }

  return (
    <div className="py-6">
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All</option>
            <option value="checked">Checked In</option>
            <option value="not">Not Checked In</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* Desktop/tablet view */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-luxe">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Place</th>
              <th className="px-4 py-2 text-left">Checked In</th>
              <th className="px-4 py-2 text-left">Check-In Time</th>
              <th className="px-4 py-2 text-left">QR Link</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const checked = Boolean(g.checkedIn);
              const time = checked && g.updatedAt ? new Date(g.updatedAt).toLocaleString() : '-';
              const qrUrl = `${window.location.origin}/guest/${g.qrId}?mode=display`;
              return (
                <tr key={g.qrId} className="border-t">
                  <td className="px-4 py-2">{g.name}</td>
                  <td className="px-4 py-2 text-gray-600">{g.place}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {checked ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{time}</td>
                  <td className="px-4 py-2 text-gray-600">
                    <div className="flex items-center gap-2 max-w-xs">
                      <a className="text-brand-ink hover:underline truncate" href={qrUrl} target="_blank" rel="noreferrer">{qrUrl}</a>
                      <button onClick={() => copyToClipboard(qrUrl, g.qrId)} className="inline-flex items-center rounded-md border border-brand-ink/20 px-2 py-1 text-xs text-brand-ink hover:bg-brand-ivory/60">
                        {copiedId === g.qrId ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-600">
                  No guests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/card view */}
      <div className="md:hidden grid gap-3">
        {filtered.map((g) => {
          const checked = Boolean(g.checkedIn);
          const time = checked && g.updatedAt ? new Date(g.updatedAt).toLocaleString() : '-';
          const qrUrl = `${window.location.origin}/guest/${g.qrId}?mode=display`;
          return (
            <div key={g.qrId} className="bg-white rounded-lg shadow-luxe p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-brand-ink">{g.name}</div>
                  <div className="text-xs text-gray-600">{g.place}</div>
                </div>
                <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {checked ? 'Checked' : 'Not yet'}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600">{time}</div>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-brand-ink px-3 py-2 text-sm text-brand-ivory"
                >
                  Open QR
                </a>
                <button
                  onClick={() => copyToClipboard(qrUrl, g.qrId)}
                  className="inline-flex items-center justify-center rounded-md border border-brand-ink/20 px-3 py-2 text-sm text-brand-ink"
                >
                  {copiedId === g.qrId ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-600 py-6">No guests found</div>
        )}
      </div>
    </div>
  );
}


