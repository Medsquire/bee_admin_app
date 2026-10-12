import React, { useState } from 'react';
import {
  Hexagon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Building2,
  Key,
  Layers,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Fingerprint,
  Zap
} from 'lucide-react';

export function LoginScreen({ onLogin, theme, toggleTheme }) {
  const [email, setEmail] = useState('admin@beeproperty.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 450);
  };

  const handleQuickDemo = () => {
    setEmail('admin@beeproperty.com');
    setPassword('PropertyAdmin2026!');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundImage: `
          linear-gradient(to right, rgba(6, 11, 20, 0.7) 0%, rgba(11, 18, 32, 0.4) 45%, rgba(6, 11, 20, 0.85) 100%),
          url('/Images/ApartmentImage.jpeg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '2rem 5vw',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(34, 211, 238, 0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Left Floating Brand Pill */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 10
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Hexagon size={24} strokeWidth={2.5} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            BeeProperty
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.05em', fontWeight: 600 }}>
            ZIVION RESIDENTIAL ADMIN
          </div>
        </div>
      </div>

      {/* Bottom Left Community Feature Pills */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          zIndex: 10,
          maxWidth: '480px'
        }}
      >

      </div>

      {/* Top Right Theme Toggle */}
      <div style={{ position: 'absolute', top: '2rem', right: '5vw', zIndex: 10 }}>
        <button
          onClick={toggleTheme}
          className="btn-icon"
          style={{ background: 'rgba(11, 18, 32, 0.75)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} color="var(--cyan-blue)" /> : <Moon size={17} color="var(--electric-blue)" />}
        </button>
      </div>

      {/* Right Side Small Login Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(11, 18, 32, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem 2rem',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(59, 130, 246, 0.2)',
          zIndex: 20,
          position: 'relative',
          animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Card Header with Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(34, 211, 238, 0.15) 100%)',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-blue)',
              margin: '0 auto 0.75rem'
            }}
          >
            <ShieldCheck size={28} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '0.25rem' }}>
            Admin Portal Access
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Sign in to manage apartments, tenants & dispatch
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Email Field with Icon */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Work Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--electric-blue)'
                }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beeproperty.com"
                className="form-input"
                style={{
                  paddingLeft: '2.5rem',
                  height: '42px',
                  background: 'rgba(6, 11, 20, 0.75)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Password Field with Icon */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--electric-blue)'
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '2.5rem',
                  height: '42px',
                  background: 'rgba(6, 11, 20, 0.75)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--electric-blue)', cursor: 'pointer' }}
              />
              <span>Remember session</span>
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              height: '44px',
              width: '100%',
              fontSize: '0.9rem',
              fontWeight: 700,
              gap: '0.5rem',
              background: 'var(--primary-gradient)',
              border: 'none',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {isLoading ? (
              <span className="status-dot status-dot-pulse" style={{ color: '#fff' }} />
            ) : (
              <>
                <LogIn size={17} />
                <span>Sign In to Portal</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
