import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getGuest, checkInGuest } from '../api';
import QRCode from 'react-qr-code';

export default function GuestCheckin() {
  const { qrId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') || 'display').toLowerCase(); // display | checkin
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setError('');
      setLoading(true);
      try {
        const g = await getGuest(qrId);
        if (!ignore) {
          setGuest(g);
          setCheckedIn(Boolean(g?.checkedIn));
        }
      } catch (err) {
        if (!ignore) setError(err?.message || 'Failed to fetch guest');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [qrId]);

  async function handleCheckIn() {
    setError('');
    try {
      setCheckingIn(true);
      const updated = await checkInGuest(qrId);
      setGuest(updated);
      setCheckedIn(true);
    } catch (err) {
      setError(err?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-600">Loading…</div>;
  }
  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }
  if (!guest) {
    return <div className="py-12 text-center text-gray-600">Guest not found</div>;
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const checkinUrl = `${origin}/guest/${qrId}?mode=checkin`;

  if (mode === 'display') {
    return (
      <div className="max-w-md mx-auto py-10 text-center">
        <div className="text-2xl font-semibold font-display text-brand-ink">Welcome to the Wedding</div>
        <div className="mt-2 text-gray-700">
          <span className="font-medium">{guest.name}</span>
          <span className="text-gray-500"> · {guest.place}</span>
        </div>
        <div className="mt-6 text-sm text-gray-600">Show this QR at entry</div>
        <div className="mt-3 inline-block bg-white p-3 rounded-lg border">
          <QRCode value={checkinUrl} size={192} />
        </div>
        <div className="mt-3 text-xs text-gray-500 break-all">{checkinUrl}</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 text-center">
      <div className="text-2xl font-semibold font-display text-brand-ink">Security Check-In</div>
      <div className="mt-2 text-gray-700">
        <span className="font-medium">{guest.name}</span>
        <span className="text-gray-500"> · {guest.place}</span>
      </div>
      {!checkedIn ? (
        <button
          onClick={handleCheckIn}
          disabled={checkingIn}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-brand-ink px-5 py-2.5 text-brand-ivory disabled:opacity-50"
        >
          {checkingIn ? 'Checking In…' : 'Check In'}
        </button>
      ) : (
        <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white">
          <span>Checked In Successfully</span>
          <span aria-hidden>✅</span>
        </div>
      )}
      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
    </div>
  );
}


