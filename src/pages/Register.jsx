import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUsers, saveUser } from '../utils/localStorage';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      setError('User with this email already exists.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };

    saveUser(newUser);
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {error && <span className="error-msg" style={{marginBottom: '1rem', display: 'block'}}>{error}</span>}
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p style={{marginTop: '1.5rem', textAlign: 'center'}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
