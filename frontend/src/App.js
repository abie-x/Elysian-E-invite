import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import AdminCreate from './pages/AdminCreate.jsx';
import GuestCheckin from './pages/GuestCheckin.jsx';
import Mosaic from './pages/Mosaic.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Shell({ children }) {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/mosaic');
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-ivory to-brand-blush text-brand-ink">
      {!hideChrome && (
        <>
          <div className="w-full border-b border-brand-rose/40 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 text-center">
              <div className="font-display text-xl sm:text-2xl tracking-tight">
                Mathew <span className="text-brand-gold">&</span> Resha
              </div>
              <div className="mt-1 text-xs sm:text-sm text-brand-ink/70">
                “Love is patient, love is kind.” — 1 Corinthians 13:4–7
              </div>
            </div>
          </div>
          <Header />
        </>
      )}
      <main className={hideChrome ? 'flex-1' : 'flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6'}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<AdminCreate />} />
          <Route path="/guest/:qrId" element={<GuestCheckin />} />
          <Route path="/mosaic" element={<Mosaic />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

export default App;
