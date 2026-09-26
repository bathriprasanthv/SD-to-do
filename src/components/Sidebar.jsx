import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, CalendarDays, CheckCircle, AlertCircle, Settings, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Today', path: '/today', icon: Calendar },
    { name: 'Upcoming', path: '/upcoming', icon: CalendarDays },
    { name: 'Completed', path: '/completed', icon: CheckCircle },
    { name: 'High Priority', path: '/high-priority', icon: AlertCircle },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <span>TodoApp</span>
          <button className="btn-icon" onClick={toggleSidebar} style={{ display: 'none' }} id="close-sidebar-btn">
            <X size={20} />
          </button>
        </div>

        <nav className="nav-links">
          {navItems.map(item => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div className="nav-link" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className="nav-link" onClick={handleLogout} style={{ color: 'var(--danger-color)' }}>
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          #close-sidebar-btn { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
