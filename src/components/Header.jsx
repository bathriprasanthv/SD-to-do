import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/tasks': return 'All Tasks';
      case '/today': return 'Today\'s Tasks';
      case '/upcoming': return 'Upcoming Tasks';
      case '/completed': return 'Completed Tasks';
      case '/high-priority': return 'High Priority Tasks';
      default: return 'Tasks';
    }
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon" onClick={toggleSidebar} style={{ display: 'none' }} id="open-sidebar-btn">
          <Menu size={24} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{getPageTitle()}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right', display: 'none' }} id="user-greeting">
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Welcome back</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          #user-greeting { display: block !important; }
        }
        @media (max-width: 768px) {
          #open-sidebar-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
