import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Receipt,
  ArrowUpRight,
  Car,
  Droplet,
  Sparkles,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { FINANCIAL_METRICS } from '../data/mockData';

export function FinancialsScreen({ onSendNotice, searchTerm = '' }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [transactions, setTransactions] = useState(FINANCIAL_METRICS.recentTransactions);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tenant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || t.category.toLowerCase().includes(filterCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Actions */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <DollarSign size={22} color="var(--electric-blue)" />
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Rent Ledger & Financials</h1>
          <span className="badge badge-online">97.8% Cleared</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => onSendNotice('Finance Team', 'Rent Roll')} className="btn btn-secondary btn-sm">
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button onClick={() => onSendNotice('Billing Office', 'Automated')} className="btn btn-primary btn-sm">
            <Receipt size={14} />
            <span>Invoices</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Building2 size={13} color="var(--cyan-blue)" /> Potential Rent
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', fontFamily: 'Outfit' }}>
            ${(FINANCIAL_METRICS.grossPotentialRent / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan-blue)', marginTop: '0.35rem' }}>100% Capacity</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <DollarSign size={13} color="var(--status-online)" /> Collected
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', fontFamily: 'Outfit', color: 'var(--status-online)' }}>
            ${(FINANCIAL_METRICS.collectedRent / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--status-online)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={12} /> 97.8% On-time
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertCircle size={13} color="var(--status-error)" /> Delinquent
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', fontFamily: 'Outfit', color: 'var(--status-error)' }}>
            ${(FINANCIAL_METRICS.delinquentAmount / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--status-error)', marginTop: '0.35rem' }}>2 In Grace Period</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TrendingUp size={13} color="var(--electric-blue)" /> NOI Margin
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', fontFamily: 'Outfit', color: 'var(--electric-blue)' }}>
            ${(FINANCIAL_METRICS.netOperatingIncome / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>79.2% Operating Margin</div>
        </div>
      </div>

      {/* Revenue Stream Breakdown Tiles with Icons */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Base Rent', share: '84.2%', amount: '$431.5k', color: 'var(--electric-blue)', icon: Building2 },
            { label: 'EV & Parking', share: '7.8%', amount: '$39.8k', color: 'var(--cyan-blue)', icon: Car },
            { label: 'Utility RUBS', share: '4.9%', amount: '$25.1k', color: 'var(--indigo)', icon: Droplet },
            { label: 'Amenity Fees', share: '3.1%', amount: '$15.9k', color: 'var(--status-online)', icon: Sparkles }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
                  <Icon size={14} color={item.color} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'Outfit' }}>{item.amount}</div>
                <div style={{ fontSize: '0.7rem', color: item.color, fontWeight: 700 }}>{item.share}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel" style={{ padding: '1.25rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={16} color="var(--electric-blue)" />
            <h3 style={{ fontSize: '1rem' }}>Recent Inflows</h3>
          </div>
          <span className="badge badge-cyan">{filteredTransactions.length} Cleared</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--input-bg-theme)', borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.65rem 0.75rem' }}>ID</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Unit</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Resident</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Method</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Amount</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--cyan-blue)', fontFamily: 'Outfit' }}>{tx.id}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>#{tx.unit}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{tx.tenant}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)' }}>{tx.method}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 800, color: 'var(--status-online)', fontFamily: 'Outfit' }}>+${tx.amount}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}><span className="badge badge-online">Cleared</span></td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                    <button onClick={() => onSendNotice(tx.tenant, tx.id)} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                      <Download size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
