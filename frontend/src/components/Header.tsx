import { NavLink } from 'react-router-dom';
import viteLogo from '/vite.svg';
import { CircleUserRound, Plus } from 'lucide-react';

export const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <NavLink to="/discover" className="header-logo">
          <div className="logo-section">
            <img src={viteLogo} className="logo" alt="Vite logo" />
            <h1>Evently</h1>
          </div>
        </NavLink>
        <div className="header-actions">
          <NavLink to="/events" className="btn btn-primary btn-3d">
            <Plus size={20} /> Create Event
          </NavLink>
          <NavLink to="/account" className="btn">
            <CircleUserRound size={20} />
          </NavLink>
        </div>
      </div>
    </header>
  );
};