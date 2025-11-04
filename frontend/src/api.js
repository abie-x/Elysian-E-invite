const API_BASE = 'https://elysian-e-invite-backend.onrender.com/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    const message = data?.error || response.statusText || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function createGuest({ name, place }) {
  const response = await fetch(`${API_BASE}/guests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, place }),
  });
  const { guest } = await handleResponse(response);
  return guest;
}

export async function getGuests() {
  const response = await fetch(`${API_BASE}/guests`);
  const { guests } = await handleResponse(response);
  return guests;
}

export async function getGuest(qrId) {
  const response = await fetch(`${API_BASE}/guests/${qrId}`);
  const { guest } = await handleResponse(response);
  return guest;
}

export async function checkInGuest(qrId) {
  const response = await fetch(`${API_BASE}/guests/${qrId}/checkin`, {
    method: 'PATCH',
  });
  const { guest } = await handleResponse(response);
  return guest;
}

export { API_BASE };



