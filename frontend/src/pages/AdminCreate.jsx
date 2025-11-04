import { useState } from 'react';
import QRCode from 'react-qr-code';
import { createGuest } from '../api';

export default function AdminCreate() {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guest, setGuest] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !place.trim()) {
      setError('Please enter name and place');
      return;
    }
    try {
      setLoading(true);
      const created = await createGuest({ name: name.trim(), place: place.trim() });
      setGuest(created);
      setName('');
      setPlace('');
    } catch (err) {
      setError(err?.message || 'Failed to create guest');
    } finally {
      setLoading(false);
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const displayUrl = guest ? `${origin}/guest/${guest.qrId}?mode=display` : '';
  const checkinUrl = guest ? `${origin}/guest/${guest.qrId}?mode=checkin` : '';
  const shareText = guest ? `Your wedding entry link: ${displayUrl}` : '';
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="py-6">
      <h1 className="text-xl font-semibold mb-4 font-display text-brand-ink">Create Guest & Generate QR</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-luxe p-4 sm:p-6 grid gap-4">
        <div className="grid gap-1">
          <label className="text-sm text-gray-700" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-ink/60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Guest name"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-gray-700" htmlFor="place">Place</label>
          <input
            id="place"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-ink/60"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="City / relation"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-brand-ink px-4 py-2 text-brand-ivory disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create Guest'}
        </button>
      </form>

      {guest && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="bg-white rounded-lg shadow-luxe p-4 flex flex-col items-center justify-center">
            <div className="mb-3 text-center">
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-gray-600">{guest.place}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <QRCode value={checkinUrl} size={192} />
            </div>
            <div className="mt-3 text-xs break-all text-gray-600 text-center">Scan to check-in: {checkinUrl}</div>
          </div>
          <div className="bg-white rounded-lg shadow-luxe p-4">
            <h2 className="font-medium mb-3">Share</h2>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Share on WhatsApp
            </a>
            <div className="mt-3 text-xs break-all text-gray-600">Share link: {displayUrl}</div>
          </div>
        </div>
      )}
    </div>
  );
}


