import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUsers } from '../utils/localStorage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      login(foundUser);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to TodoApp</h2>
        <form onSubmit={handleSubmit}>
          {error && <span className="error-msg" style={{marginBottom: '1rem', display: 'block'}}>{error}</span>}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p style={{marginTop: '1.5rem', textAlign: 'center'}}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
