import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('staff');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save user info to localStorage
    localStorage.setItem('userType', userType);
    localStorage.setItem('userEmail', email);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo */}
        <div style={{textAlign: 'center' as const, marginBottom: '2rem'}}>
          <div className="logo">LOGO</div>
          <h1 className="login-title">Organization App</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* User Type */}
          <div className="input-group">
            <label className="input-label">I am a:</label>
            <div className="user-type-buttons">
              {['staff', 'hod', 'super-admin'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`user-type-button ${userType === type ? 'active' : ''}`}
                >
                  {type === 'staff' && 'Staff'}
                  {type === 'hod' && 'HOD'}
                  {type === 'super-admin' && 'Super Admin'}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your.email@company.com"
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        {/* Demo Info */}
        <div className="demo-info">
          <p className="demo-text">
            <strong>Demo:</strong> Use any email/password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;