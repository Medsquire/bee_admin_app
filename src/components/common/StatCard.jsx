import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue', subtitle, onClick }) {
  const colorMap = {
    blue: {
      bg: 'var(--primary-blue-subtle)',
      text: 'var(--primary-blue)',
      border: 'var(--primary-blue-border)'
    },
    green: {
      bg: 'var(--success-bg)',
      text: 'var(--success)',
      border: 'var(--success-border)'
    },
    amber: {
      bg: 'var(--warning-bg)',
      text: 'var(--warning)',
      border: 'var(--warning-border)'
    },
    purple: {
      bg: 'rgba(147, 51, 234, 0.14)',
      text: '#9333EA',
      border: 'rgba(168, 85, 247, 0.3)'
    },
    navy: {
      bg: 'var(--light-blue)',
      text: 'var(--primary-blue)',
      border: 'var(--border-color)'
    }
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`stat-card ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex-between">
        <span className="stat-card-label">{title}</span>
        {Icon && (
          <div
            className="stat-card-icon-wrapper"
            style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
          >
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <div className="stat-card-val">{value}</div>
        {subtitle && (
          <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
        {trend && (
          <div
            className="text-xs font-medium"
            style={{ marginTop: '0.25rem', color: trend.isPositive ? '#16A34A' : '#D97706' }}
          >
            {trend.text}
          </div>
        )}
      </div>
    </div>
  );
}
