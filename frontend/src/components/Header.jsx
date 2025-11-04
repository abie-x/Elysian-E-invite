import { NavLink } from 'react-router-dom';

export default function Header() {
  const linkBase = 'px-2 sm:px-3 py-2 rounded-md text-sm font-medium';
  return (
    <header className="w-full border-b border-brand-rose/40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-center">
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-brand-ink text-brand-ivory' : 'text-brand-ink hover:bg-brand-ivory/60'}`
              }
            >
              Create Guest QR
            </NavLink>
            <NavLink
              to="/mosaic"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-brand-ink text-brand-ivory' : 'text-brand-ink hover:bg-brand-ivory/60'}`
              }
            >
              View Guest
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-brand-ink text-brand-ivory' : 'text-brand-ink hover:bg-brand-ivory/60'}`
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}



