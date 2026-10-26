import React from 'react';

export default function StatusBadge({ status }) {
  let badgeClass = 'badge-slate';
  let label = status;

  if (!status) return null;

  const normalized = String(status).toLowerCase();

  // Occupancy
  if (normalized === 'occupied') {
    badgeClass = 'badge-blue';
    label = 'Occupied';
  } else if (normalized === 'vacant') {
    badgeClass = 'badge-slate';
    label = 'Vacant';
  }
  // Maintenance statuses
  else if (normalized === 'reported') {
    badgeClass = 'badge-amber';
    label = 'Reported';
  } else if (normalized === 'pending assignment' || normalized === 'pending') {
    badgeClass = 'badge-amber';
    label = 'Pending Assignment';
  } else if (normalized === 'assigned') {
    badgeClass = 'badge-blue';
    label = 'Assigned';
  } else if (normalized === 'in progress') {
    badgeClass = 'badge-blue';
    label = 'In Progress';
  } else if (normalized === 'completed' || normalized === 'resolved') {
    badgeClass = 'badge-green';
    label = 'Completed';
  }
  // Agency availability
  else if (normalized === 'available') {
    badgeClass = 'badge-green';
    label = 'Available';
  } else if (normalized === 'partially available') {
    badgeClass = 'badge-amber';
    label = 'Partially Available';
  } else if (normalized === 'fully allocated') {
    badgeClass = 'badge-red';
    label = 'Fully Allocated';
  } else if (normalized === 'unavailable' || normalized === 'on leave') {
    badgeClass = 'badge-slate';
    label = 'Unavailable';
  }
  // Priorities
  else if (normalized === 'high' || normalized === 'critical') {
    badgeClass = 'badge-red';
    label = 'High Priority';
  } else if (normalized === 'medium') {
    badgeClass = 'badge-amber';
    label = 'Medium';
  } else if (normalized === 'low') {
    badgeClass = 'badge-slate';
    label = 'Low';
  }
  // RWA statuses
  else if (normalized === 'active') {
    badgeClass = 'badge-green';
    label = 'Active';
  } else if (normalized === 'not registered') {
    badgeClass = 'badge-slate';
    label = 'Not Registered';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
}
