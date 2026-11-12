import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Wrench, BarChart3, CheckCircle2, Clock } from 'lucide-react';

const STATUS_COLORS = {
  'Pending': '#D97706',      // Amber
  'In Progress': '#2563EB',  // Professional BEE Blue
  'Completed': '#16A34A',    // Green
  'Cancelled': '#94A3B8'     // Slate
};

const CATEGORY_BLUE_PALETTE = [
  '#1E40AF', // Blue 800
  '#2563EB', // Blue 600
  '#3B82F6', // Blue 500
  '#60A5FA', // Blue 400
  '#0284C7', // Sky 600
  '#0EA5E9', // Sky 500
  '#38BDF8', // Sky 400
  '#7DD3FC'  // Sky 300
];

export default function ServiceRequestCharts({ maintenanceRequests = [] }) {
  // 1. Service Request Status Breakdown (Donut Chart)
  const { statusData, totalRequests, completedRequests, openRequests, resolutionRate } = useMemo(() => {
    const counts = {
      'Pending': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0
    };

    maintenanceRequests.forEach((req) => {
      const s = (req.status || '').toLowerCase().trim();
      if (s.includes('cancel') || s.includes('reject') || s === 'closed') {
        counts['Cancelled']++;
      } else if (s.includes('complete') || s.includes('resolved')) {
        counts['Completed']++;
      } else if (s === 'assigned' || s.includes('progress') || s === 'scheduled') {
        counts['In Progress']++;
      } else {
        counts['Pending']++;
      }
    });

    const total = maintenanceRequests.length;
    const completed = counts['Completed'];
    const open = total - completed - counts['Cancelled'];
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const data = [
      {
        name: 'Pending',
        value: counts['Pending'],
        color: STATUS_COLORS['Pending'],
        pct: total > 0 ? Math.round((counts['Pending'] / total) * 100) : 0
      },
      {
        name: 'In Progress',
        value: counts['In Progress'],
        color: STATUS_COLORS['In Progress'],
        pct: total > 0 ? Math.round((counts['In Progress'] / total) * 100) : 0
      },
      {
        name: 'Completed',
        value: counts['Completed'],
        color: STATUS_COLORS['Completed'],
        pct: total > 0 ? Math.round((counts['Completed'] / total) * 100) : 0
      },
      {
        name: 'Cancelled',
        value: counts['Cancelled'],
        color: STATUS_COLORS['Cancelled'],
        pct: total > 0 ? Math.round((counts['Cancelled'] / total) * 100) : 0
      }
    ];

    return {
      statusData: data,
      totalRequests: total,
      completedRequests: completed,
      openRequests: open,
      resolutionRate: rate
    };
  }, [maintenanceRequests]);

  // 2. Service Requests by Category (Horizontal Bar Chart)
  const categoryData = useMemo(() => {
    const map = {};
    maintenanceRequests.forEach((req) => {
      const cat = req.category || 'General Maintenance';
      map[cat] = (map[cat] || 0) + 1;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // Top 6 categories for uncluttered, clean appearance
      .map(([cat, count], idx) => ({
        category: cat.length > 18 ? `${cat.substring(0, 16)}...` : cat,
        fullCategory: cat,
        requests: count,
        fill: CATEGORY_BLUE_PALETTE[idx % CATEGORY_BLUE_PALETTE.length]
      }));
  }, [maintenanceRequests]);

  // Custom Glassmorphic Tooltip for Donut
  const CustomStatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${data.color}`,
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: data.color
              }}
            />
            <strong style={{ fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>{data.name}</strong>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Requests: <strong style={{ color: 'var(--dark-navy)' }}>{data.value}</strong> ({data.pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Glassmorphic Tooltip for Category Bar
  const CustomCategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = totalRequests > 0 ? Math.round((data.requests / totalRequests) * 100) : 0;
      return (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--primary-blue-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}
        >
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
            {data.fullCategory}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Requests: <strong style={{ color: 'var(--primary-blue)' }}>{data.requests}</strong> ({pct}% of total)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section aria-label="Service Request Analytics">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* CHART CARD 1: Service Request Status — Donut Chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-blue-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-blue)'
                }}
              >
                <Wrench size={16} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', margin: 0 }}>
                Service Request Status
              </h2>
            </div>
            <span
              className="badge badge-blue"
              style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem' }}
            >
              {totalRequests} Total Requests
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Donut Chart Visual */}
            <div style={{ flex: '1 1 200px', height: '220px', minWidth: '180px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomStatusTooltip />} />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Stat */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-navy)', lineHeight: 1 }}>
                  {totalRequests}
                </div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginTop: '0.2rem'
                  }}
                >
                  Tickets
                </div>
              </div>
            </div>

            {/* Status Legend & Count Breakdown */}
            <div
              style={{
                flex: '1 1 140px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                justifyContent: 'center'
              }}
            >
              {statusData.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        flexShrink: 0
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--dark-navy)' }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                      {item.value}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART CARD 2: Service Completion Overview / Requests by Category */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-blue-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-blue)'
                }}
              >
                <BarChart3 size={16} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', margin: 0 }}>
                Service Requests by Category
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--success)',
                  backgroundColor: 'var(--success-bg)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px'
                }}
              >
                {resolutionRate}% Resolved
              </span>
            </div>
          </div>

          {/* Horizontal Bar Chart */}
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-color)' }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  width={110}
                />
                <Tooltip content={<CustomCategoryTooltip />} cursor={{ fill: 'var(--primary-blue-subtle)' }} />
                <Bar dataKey="requests" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Category Summary Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              marginTop: '0.5rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} color="var(--primary-blue)" />
              <span>Active: <strong style={{ color: 'var(--dark-navy)' }}>{openRequests}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} color="var(--success)" />
              <span>Completed: <strong style={{ color: 'var(--dark-navy)' }}>{completedRequests}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Top: <strong style={{ color: 'var(--dark-navy)' }}>{categoryData[0]?.fullCategory || 'N/A'}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

