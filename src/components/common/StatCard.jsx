import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue', subtitle, onClick }) {
  const colorMap = {
    blue: {
      bg: '#EFF6FF',
      text: '#2563EB',
      border: '#BFDBFE'
    },
    green: {
      bg: '#DCFCE7',
      text: '#16A34A',
      border: '#BBF7D0'
    },
    amber: {
      bg: '#FEF3C7',
      text: '#D97706',
      border: '#FDE68A'
    },
    purple: {
      bg: '#F3E8FF',
      text: '#9333EA',
      border: '#E9D5FF'
    },
    navy: {
      bg: '#EFF6FF',
      text: '#172554',
      border: '#CBD5E1'
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
