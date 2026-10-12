import React, { useState } from 'react';
import {
  Palette,
  Check,
  Copy,
  Layers,
  Sparkles,
  MousePointer,
  Sun,
  Moon,
  Zap,
  Terminal,
  Sliders
} from 'lucide-react';

export function ThemeGuideScreen({ theme, toggleTheme, onCopyColor }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (hex, name) => {
    navigator.clipboard?.writeText(hex);
    setCopiedCode(name);
    if (onCopyColor) onCopyColor(name, hex);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const primaryColors = [
    { num: 1, name: 'Primary Navy', hex: '#0B1220', textLight: true, role: 'Base brand & sidebar structure' },
    { num: 2, name: 'Electric Blue', hex: '#3B82F6', textLight: true, role: 'Primary interactive call-to-actions' },
    { num: 3, name: 'Cyan Blue', hex: '#22D3EE', textLight: false, role: 'Telemetry, highlights & accents' },
    { num: 4, name: 'Light Background', hex: '#F8FAFC', textLight: false, role: 'Daytime surface foundation' },
    { num: 5, name: 'Dark Background', hex: '#060B14', textLight: true, role: 'Executive night canvas' }
  ];

  const uiColors = [
    { num: 6, name: 'Card / Glass', hex: '#FFFFFFCC', textLight: false, role: 'Frosted glassmorphism panels' },
    { num: 7, name: 'Text Primary', hex: '#111827', textLight: true, role: 'High-contrast typography' },
    { num: 8, name: 'Text Secondary', hex: '#64748B', textLight: true, role: 'Descriptive subheadings & hints' },
    { num: 9, name: 'Success', hex: '#10B981', textLight: true, role: 'Occupied units & cleared payments' },
    { num: 10, name: 'Warning', hex: '#F59E0B', textLight: false, role: 'Turnover & pending renewals' },
    { num: 11, name: 'Error', hex: '#EF4444', textLight: true, role: 'Urgent HVAC alerts & delinquent rent' },
    { num: 12, name: 'Border', hex: '#E2E8F0', textLight: false, role: 'Subtle component dividers' }
  ];

  const additionalColors = [
    { num: 13, name: 'White', hex: '#FFFFFF', textLight: false },
    { num: 14, name: 'Light Blue', hex: '#DBEAFE', textLight: false },
    { num: 15, name: 'Dark Blue', hex: '#1E3A8A', textLight: true },
    { num: 16, name: 'Slate Gray', hex: '#94A3B8', textLight: false },
    { num: 17, name: 'Dark Slate', hex: '#1E293B', textLight: true },
    { num: 18, name: 'Light Cyan', hex: '#CFFAFE', textLight: false },
    { num: 19, name: 'Indigo', hex: '#6366F1', textLight: true },
    { num: 20, name: 'Resolved / Neutral', hex: '#E2E8F0', textLight: false }
  ];

  const gradients = [
    { num: 21, name: 'Primary Gradient', css: 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%)', label: '#3B82F6 → #22D3EE' },
    { num: 22, name: 'Secondary Gradient', css: 'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)', label: '#6366F1 → #22D3EE' },
    { num: 23, name: 'Dark Gradient', css: 'linear-gradient(180deg, #060B14 0%, #0B1220 100%)', label: '#060B14 → #0B1220' },
    { num: 24, name: 'Blue Gradient', css: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)', label: '#1D4ED8 → #3B82F6' }
  ];

  const statusColors = [
    { num: 37, name: 'Online / Occupied', hex: '#10B981' },
    { num: 38, name: 'Pending / Turnover', hex: '#F59E0B' },
    { num: 39, name: 'Issue / Escalation', hex: '#EF4444' },
    { num: 40, name: 'In Progress / Assigned', hex: '#3B82F6' },
    { num: 41, name: 'Resolved / Inspected', hex: '#E2E8F0' },
    { num: 42, name: 'Notification Alert', hex: '#22D3EE' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Design System Header */}
      <div className="glass-panel" style={{ padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-cyan">theme.md Specification</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>42 Color Design System Reference</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>ZIVION Design System & Tokens</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '640px' }}>
            Live color swatches, gradients, interactive UI components, and typographic hierarchy directly coded from <code>theme.md</code>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={toggleTheme} className="btn btn-secondary">
            {theme === 'dark' ? <Sun size={16} color="var(--cyan-blue)" /> : <Moon size={16} color="var(--electric-blue)" />}
            <span>Preview in {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* 1. Primary Colors (theme.md #1-5) */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>1. Primary Colors (Tokens #1–5)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Structural architectural tones forming the foundation of BeeProperty Admin
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {primaryColors.map(c => (
            <div
              key={c.num}
              onClick={() => copyToClipboard(c.hex, c.name)}
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--input-bg-theme)',
                border: '1px solid var(--border-card)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                height: '84px',
                background: c.hex,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: c.textLight ? '#FFFFFF' : '#111827',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {copiedCode === c.name ? <Check size={20} /> : c.hex}
              </div>
              <div style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-blue)', fontWeight: 700 }}>#{c.num}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. UI Colors (theme.md #6-12) */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>2. UI Semantic Colors (Tokens #6–12)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Card backgrounds, text hierarchies, borders, and functional feedback
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {uiColors.map(c => (
            <div
              key={c.num}
              onClick={() => copyToClipboard(c.hex, c.name)}
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--input-bg-theme)',
                border: '1px solid var(--border-card)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                height: '60px',
                background: c.hex,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: c.textLight ? '#FFFFFF' : '#111827',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                {copiedCode === c.name ? <Check size={18} /> : c.hex}
              </div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>#{c.num}</div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Gradient Systems (theme.md #21-24) */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>3. Gradient Presets (Tokens #21–24)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Vibrant multi-stop color transitions for action buttons, charts, and brand visual accents
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {gradients.map(g => (
            <div
              key={g.num}
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-card)',
                background: 'var(--input-bg-theme)'
              }}
            >
              <div style={{ height: '90px', background: g.css, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '20px', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                  Token #{g.num}
                </span>
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{g.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                  {g.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Status Colors (theme.md #37-42) */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>4. Status & Operations Colors (Tokens #37–42)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Real-time unit conditions, technician SLA urgency, and tenant portal notifications
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {statusColors.map(s => (
            <div
              key={s.num}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--input-bg-theme)',
                border: '1px solid var(--border-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: s.hex, flexShrink: 0, boxShadow: `0 0 10px ${s.hex}66` }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{s.num} • {s.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Interactive Components Showcase */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>5. Component Styling Sandbox</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Pre-styled button variants, inputs, and glassmorphic badge elevations
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary">Primary Action (#3B82F6)</button>
          <button className="btn btn-gradient">Gradient Sparkle</button>
          <button className="btn btn-secondary">Secondary Outline</button>
          <span className="badge badge-online"><span className="status-dot status-dot-pulse" /> Online #10B981</span>
          <span className="badge badge-vacant">Vacant Ready #22D3EE</span>
          <span className="badge badge-warning">Pending Review #F59E0B</span>
          <span className="badge badge-urgent">Urgent Escalation #EF4444</span>
        </div>
      </div>
    </div>
  );
}
