import React from 'react';

const assetPerformanceData = [
  { asset: 'Gold', y1: 57.94, y3: 33.02, y5: 18.40 },
  // { asset: 'Intl Developed Markets', y1: 26.26, y3: 15.87, y5: 9.49 },
  // { asset: 'Emerging Markets', y1: 22.81, y3: 14.30, y5: 6.22 },
  { asset: 'US Stock Market (S&P 500)', y1: 17.53, y3: 24.89, y5: 16.45 },
  { asset: 'Commodities', y1: 15.84, y3: 4.26, y5: 11.62 },
  // { asset: 'Intermediate Treasuries', y1: 6.44, y3: 4.17, y5: -0.18 },
  // { asset: 'Total Bond Market', y1: 5.70, y3: 4.52, y5: -0.34 },
  // { asset: 'Short Treasuries', y1: 5.09, y3: 4.44, y5: 1.68 },
  { asset: 'US Bonds', y1: 3.74, y3: 1.96, y5: -4.43 },
  // { asset: 'Long Treasuries', y1: 1.71, y3: 0.59, y5: -7.15 },
];

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-title" style={{ color: '#22223b', fontWeight: 700, fontSize: '2rem' }}>
        AI Portfolio
      </div>
      {/* <nav className="dashboard-nav" style={{ display: 'flex', gap: '2rem', fontSize: '1rem', color: '#22223b' }}>
        <a href="#">Analysis</a>
        <a href="#">Markets</a>
        <a href="#">Docs</a>
        <a href="#">Region</a>
        <a href="#">Tools</a>
        <a href="#">Sign Up</a>
        <a href="#">Log In</a>
      </nav> */}
    </header>
  );
}

function SegmentedControl({ segments, active, onChange }) {
  return (
    <div className="segmented-control" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
      {segments.map((seg, idx) => (
        <button
          key={seg}
          className={`segment-btn${active === idx ? ' active' : ''}`}
          style={{
            background: active === idx ? '#22223b' : '#f3f4f6',
            color: active === idx ? '#fff' : '#22223b',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.75rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 500,
            boxShadow: '0 1px 4px rgba(30,41,59,0.04)',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={() => onChange(idx)}
        >
          {seg}
        </button>
      ))}
    </div>
  );
}

function AssetPerformanceTable({ data }) {
  const [checked, setChecked] = React.useState(Array(data.length).fill(false));
  const [expanded, setExpanded] = React.useState(false);
  const subsectors = [
    { asset: 'Communication Services', y1: 8.2, y3: 5.1, y5: 2.3 },
    { asset: 'Consumer Discretionary', y1: 7.5, y3: 6.2, y5: 3.1 },
    { asset: 'Consumer Staples', y1: 6.8, y3: 4.9, y5: 2.7 },
    { asset: 'Energy', y1: 5.9, y3: 3.8, y5: 1.9 },
    { asset: 'Financials', y1: 9.1, y3: 7.2, y5: 4.5 },
    { asset: 'Health Care', y1: 10.3, y3: 8.7, y5: 5.6 },
    { asset: 'Industrials', y1: 6.2, y3: 5.0, y5: 2.8 },
    { asset: 'Information Technology', y1: 12.4, y3: 10.1, y5: 7.3 },
    { asset: 'Materials', y1: 4.7, y3: 3.2, y5: 1.5 },
    { asset: 'Real Estate', y1: 3.5, y3: 2.1, y5: 0.9 },
    { asset: 'Utilities', y1: 2.8, y3: 1.7, y5: 0.6 },
  ];
  const [subChecked, setSubChecked] = React.useState(Array(subsectors.length).fill(true));
  const isStockMarketChecked = subChecked.every(Boolean);

  const handleCheck = (idx) => {
    if (data[idx].asset === 'US Stock Market (S&P 500)') {
      const newVal = !isStockMarketChecked;
      setSubChecked(Array(subsectors.length).fill(newVal));
    } else {
      setChecked((prev) => {
        const updated = [...prev];
        updated[idx] = !updated[idx];
        return updated;
      });
    }
  };

  const handleSubCheck = (idx) => {
    setSubChecked((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1.5rem',
      boxShadow: '0 2px 12px rgba(30,41,59,0.08)',
      padding: '2rem',
      margin: '0 auto',
      maxWidth: '98%',
      overflowX: 'auto',
    }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'transparent', borderRadius: '1.25rem', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={{ background: '#fff', width: '48px' }}></th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>Asset Class</th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>1Y</th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>3Y</th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>5Y</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <React.Fragment key={row.asset}>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={row.asset === 'US Stock Market (S&P 500)' ? isStockMarketChecked : checked[idx]}
                    onChange={() => handleCheck(idx)}
                    style={{ width: '20px', height: '20px', accentColor: '#6366f1', cursor: 'pointer' }}
                  />
                </td>
                <td style={{ color: '#22223b', fontWeight: 500, fontSize: '1.1rem', padding: '1rem 1.5rem' }}>
                  {row.asset === 'US Stock Market (S&P 500)' ? (
                    <span style={{ position: 'relative' }}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpanded((v) => !v)}
                      >
                        US Stock Market (S&P 500) {expanded ? '▲' : '▼'}
                      </span>
                    </span>
                  ) : (
                    row.asset
                  )}
                </td>
                <td style={{ background: row.y1 > 0 ? '#d1fae5' : row.y1 < 0 ? '#fee2e2' : '#f3f4f6', color: row.y1 > 0 ? '#065f46' : row.y1 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 600 }}>{row.y1}%</td>
                <td style={{ background: row.y3 > 0 ? '#d1fae5' : row.y3 < 0 ? '#fee2e2' : '#f3f4f6', color: row.y3 > 0 ? '#065f46' : row.y3 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 600 }}>{row.y3}%</td>
                <td style={{ background: row.y5 > 0 ? '#d1fae5' : row.y5 < 0 ? '#fee2e2' : '#f3f4f6', color: row.y5 > 0 ? '#065f46' : row.y5 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 600 }}>{row.y5}%</td>
              </tr>
              {row.asset === 'US Stock Market (S&P 500)' && expanded && (
                subsectors.map((sub, subIdx) => (
                  <tr key={sub.asset} style={{ background: '#f9fafb' }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={subChecked[subIdx]}
                        onChange={() => handleSubCheck(subIdx)}
                        style={{ width: '18px', height: '18px', accentColor: '#6366f1', marginRight: '0.5rem' }}
                      />
                    </td>
                    <td style={{ color: '#22223b', fontWeight: 400, fontSize: '1rem', padding: '0.75rem 1.5rem', paddingLeft: '2.5rem' }}>{sub.asset}</td>
                    <td style={{ background: sub.y1 > 0 ? '#d1fae5' : sub.y1 < 0 ? '#fee2e2' : '#f3f4f6', color: sub.y1 > 0 ? '#065f46' : sub.y1 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500 }}>{sub.y1}%</td>
                    <td style={{ background: sub.y3 > 0 ? '#d1fae5' : sub.y3 < 0 ? '#fee2e2' : '#f3f4f6', color: sub.y3 > 0 ? '#065f46' : sub.y3 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500 }}>{sub.y3}%</td>
                    <td style={{ background: sub.y5 > 0 ? '#d1fae5' : sub.y5 < 0 ? '#fee2e2' : '#f3f4f6', color: sub.y5 > 0 ? '#065f46' : sub.y5 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500 }}>{sub.y5}%</td>
                  </tr>
                ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DashboardDemo() {
  const [activeSegment, setActiveSegment] = React.useState(1);
  const segments = ['Countries', 'Asset Classes', 'Sectors', 'Watchlist'];

  return (
    <div className="dashboard-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2vw' }}>
      <DashboardHeader />
      <SegmentedControl segments={segments} active={activeSegment} onChange={setActiveSegment} />
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          background: '#f3f4f6',
          borderRadius: '2rem',
          boxShadow: '0 2px 8px rgba(30,41,59,0.04)',
          minHeight: '50vh',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            flex: '1 1 0',
            minWidth: '300px',
            maxWidth: '100%',
            minHeight: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            boxSizing: 'border-box',
          }}
        >
          {/* Placeholder for chart */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#f3f4f6',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            [Chart Area]
          </div>
        </div>
        <div
          style={{
            flex: '1 1 0',
            minWidth: '300px',
            maxWidth: '100%',
            width: '50%',
            boxSizing: 'border-box',
            overflowX: 'visible',
          }}
        >
          <h2
            style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#22223b',
            }}
          >
            Asset Class Performance
          </h2>
          <AssetPerformanceTable data={assetPerformanceData} />
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .dashboard-container {
            padding: 1vw !important;
          }
          .card {
            flex-direction: column !important;
            gap: 1rem !important;
            padding: 1rem !important;
          }
        }
        @media (max-width: 600px) {
          .dashboard-title {
            font-size: 1.1rem !important;
          }
          .card {
            padding: 0.5rem !important;
            border-radius: 1rem !important;
          }
          .data-table th, .data-table td {
            padding: 0.5rem 0.5rem !important;
            font-size: 0.9rem !important;
          }
          .data-table {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardDemo;