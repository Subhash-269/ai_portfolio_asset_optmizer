import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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

function PortfolioResults({ result }) {
  const hasApi = result && Array.isArray(result.portfolio);
  const sectors = hasApi ? result.sectors || [] : [];
  const tickersUsed = hasApi ? result.tickers_used || [] : [];
  const companiesUsedCount = hasApi ? (Array.isArray(result.tickers_used) ? result.tickers_used.length : 0) : 0;
  const portfolio = hasApi ? [...result.portfolio].sort((a, b) => b.allocation - a.allocation) : [];

  const sectorDistribution = React.useMemo(() => {
    const agg = {};
    portfolio.forEach((row) => {
      const sec = row.sector || 'Unknown';
      const val = Number(row.allocation) || 0;
      agg[sec] = (agg[sec] || 0) + val;
    });
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  }, [portfolio]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f43f5e', '#84cc16', '#a78bfa'];

  return (
    <div className="dashboard-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2vw', minHeight: '70vh', background: '#f3f4f6' }}>
      <div className="card" style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 2px 12px rgba(30,41,59,0.08)', padding: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem', color: '#22223b', fontFamily: 'Poppins, Inter, sans-serif' }}>Portfolio Results</h2>

        {hasApi && sectors.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Sectors</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {sectors.map(s => (
                <span key={s} style={{ background: '#f3f4f6', color: '#22223b', borderRadius: '999px', padding: '0.35rem 0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {hasApi && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Companies Data Used</div>
            <div style={{ color: '#22223b', fontSize: '1rem', fontWeight: 600 }}>{companiesUsedCount}</div>
          </div>
        )}

        {hasApi && sectorDistribution.length > 0 && (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ flex: '1 1 0', minWidth: '280px', height: '280px' }}>
              <div style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Sector Distribution</div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectorDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2} stroke="#fff" labelLine={false} label={({ value }) => `${Number(value).toFixed(1)}%`}>
                    {sectorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${Number(v).toFixed(2)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {hasApi && portfolio.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#22223b', fontWeight: 600 }}>Company</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#22223b', fontWeight: 600 }}>Sector</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#22223b', fontWeight: 600 }}>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map(row => (
                <tr key={`${row.ticker}-${row.sector}`}>
                  <td style={{ padding: '0.75rem 1rem', color: '#22223b', fontWeight: 600 }}>{row.abbr || row.ticker}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#22223b' }}>{row.sector}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#22223b', textAlign: 'right' }}>{`${Number(row.allocation).toFixed(2)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ marginTop: '0.5rem', color: '#6b7280' }}>No portfolio results available.</div>
        )}
      </div>
    </div>
  );
}

function AssetPerformanceTable({ data, checked, handleCheck, onCreatePortfolio, sp500Averages, subsectors, subChecked, setSubChecked }) {
  const [expanded, setExpanded] = React.useState(false);
  const isSubsectorsProvided = Array.isArray(subsectors) && subsectors.length > 0;
  const isStockMarketChecked = subChecked.every(Boolean);

  // Select all/deselect all logic for S&P 500
  const handleSP500Check = () => {
    const newVal = !isStockMarketChecked;
    setSubChecked(Array(subsectors.length).fill(newVal));
  };

  const handleSubCheck = (idx) => {
    setSubChecked((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  // Button enabled if any checked OR any subChecked
  const isAnySelected = checked.some(Boolean) || subChecked.some(Boolean);

  return (
    <>
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
                    {row.asset === 'US Stock Market (S&P 500)' ? (
                      <input
                        type="checkbox"
                        checked={isStockMarketChecked}
                        onChange={handleSP500Check}
                        style={{ width: '20px', height: '20px', accentColor: '#6366f1', cursor: 'pointer' }}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={checked[idx]}
                        onChange={() => handleCheck(idx)}
                        style={{ width: '20px', height: '20px', accentColor: '#6366f1', cursor: 'pointer' }}
                      />
                    )}
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
                    {(() => { const vals = (row.asset === 'US Stock Market (S&P 500)' && sp500Averages) ? sp500Averages : { y1: row.y1, y3: row.y3, y5: row.y5 }; return (
                    <>
                      <td style={{ background: vals.y1 > 0 ? '#d1fae5' : vals.y1 < 0 ? '#fee2e2' : '#f3f4f6', color: vals.y1 > 0 ? '#065f46' : vals.y1 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 600 }}>{vals.y1}%</td>
                      <td style={{ background: vals.y3 > 0 ? '#d1fae5' : vals.y3 < 0 ? '#fee2e2' : '#f3f4f6', color: vals.y3 > 0 ? '#065f46' : vals.y3 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 600 }}>{vals.y3}%</td>
                      <td style={{ background: vals.y5 > 0 ? '#d1fae5' : vals.y5 < 0 ? '#fee2e2' : '#f3f4f6', color: vals.y5 > 0 ? '#065f46' : vals.y5 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 600 }}>{vals.y5}%</td>
                    </>
                  ); })()}
                </tr>
                  {row.asset === 'US Stock Market (S&P 500)' && expanded && isSubsectorsProvided && (
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
      <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
        <button
          className="btn-primary"
          disabled={!isAnySelected}
          onClick={isAnySelected ? () => onCreatePortfolio({ checked, subChecked }) : undefined}
          style={{
            background: !isAnySelected ? '#e5e7eb' : '#22223b',
            color: !isAnySelected ? '#888' : '#fff',
            border: 'none',
            borderRadius: '1rem',
            padding: '0.75rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(30,41,59,0.10)',
            cursor: !isAnySelected ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          Create a Portfolio
        </button>
      </div>
    </>
  );
}

function SP500StocksTable({ subsectors, subChecked, handleSubCheck }) {
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
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>S&P 500 Sector</th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>1Y</th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>3Y</th>
            <th style={{ background: '#fff', color: '#22223b', fontWeight: 700, fontSize: '1.3rem', padding: '1rem 1.5rem' }}>5Y</th>
          </tr>
        </thead>
        <tbody>
          {subsectors.map((sub, subIdx) => (
            <tr key={sub.asset} style={{ background: '#f9fafb' }}>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={subChecked[subIdx]}
                  onChange={() => handleSubCheck(subIdx)}
                  style={{ width: '18px', height: '18px', accentColor: '#6366f1', marginRight: '0.5rem' }}
                />
              </td>
              <td style={{ color: '#22223b', fontWeight: 400, fontSize: '1rem', padding: '0.75rem 1.5rem' }}>{sub.asset}</td>
              <td style={{ background: sub.y1 > 0 ? '#d1fae5' : sub.y1 < 0 ? '#fee2e2' : '#f3f4f6', color: sub.y1 > 0 ? '#065f46' : sub.y1 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500 }}>{sub.y1}%</td>
              <td style={{ background: sub.y3 > 0 ? '#d1fae5' : sub.y3 < 0 ? '#fee2e2' : '#f3f4f6', color: sub.y3 > 0 ? '#065f46' : sub.y3 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500 }}>{sub.y3}%</td>
              <td style={{ background: sub.y5 > 0 ? '#d1fae5' : sub.y5 < 0 ? '#fee2e2' : '#f3f4f6', color: sub.y5 > 0 ? '#065f46' : sub.y5 < 0 ? '#991b1b' : '#22223b', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500 }}>{sub.y5}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TemplatesPage() {
  return (
    <div className="dashboard-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2vw', minHeight: '70vh', background: '#f3f4f6' }}>
      <div className="card" style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 2px 12px rgba(30,41,59,0.08)', padding: '2rem', margin: '0 auto', maxWidth: '900px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#22223b', fontFamily: 'Poppins, Inter, sans-serif' }}>Templates</h2>
        <p style={{ color: '#22223b', fontSize: '1.1rem', fontFamily: 'Poppins, Inter, sans-serif' }}>
          Here you can manage and select portfolio templates. (Demo content)
        </p>
        <ul style={{ marginTop: '2rem', paddingLeft: 0, listStyle: 'none' }}>
          <li style={{ background: '#f3f4f6', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1rem', color: '#22223b', fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 500 }}>Conservative Portfolio</li>
          <li style={{ background: '#f3f4f6', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1rem', color: '#22223b', fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 500 }}>Balanced Portfolio</li>
          <li style={{ background: '#f3f4f6', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1rem', color: '#22223b', fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 500 }}>Aggressive Portfolio</li>
        </ul>
      </div>
    </div>
  );
}

function DashboardDemo() {

  const [activeSegment, setActiveSegment] = React.useState(0);
  const segments = ['Asset Classes', 'S&P 500 Stocks', 'Composite', 'Portfolios'];
  const [checked, setChecked] = React.useState(Array(assetPerformanceData.length).fill(false));
  const [showPortfolio, setShowPortfolio] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [portfolioData, setPortfolioData] = React.useState(null);
  const [sectorReturns, setSectorReturns] = React.useState(null);
  const [sp500Averages, setSp500Averages] = React.useState(null);

  // Configure API base to work in dev (CRA) and production
  const API_BASE = process.env.REACT_APP_API_BASE || '';

  React.useEffect(() => {
    const controller = new AbortController();
    console.log('[DashboardDemo] Fetching sector returns from', `${API_BASE}/model/sp500/gics-returns/`);
    fetch(`${API_BASE}/model/sp500/gics-returns/`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to fetch sector returns')))
      .then(data => {
        console.log('[DashboardDemo] Sector returns response:', data);
        if (Array.isArray(data)) {
          setSectorReturns(data);
          const sum = data.reduce((acc, s) => ({
            y1: acc.y1 + (Number(s.y1) || 0),
            y3: acc.y3 + (Number(s.y3) || 0),
            y5: acc.y5 + (Number(s.y5) || 0),
          }), { y1: 0, y3: 0, y5: 0 });
          const n = data.length || 1;
          setSp500Averages({
            y1: +(sum.y1 / n).toFixed(2),
            y3: +(sum.y3 / n).toFixed(2),
            y5: +(sum.y5 / n).toFixed(2),
          });
        }
      })
      .catch((err) => {
        console.error('[DashboardDemo] Fetch sector returns error:', err);
      });
    return () => controller.abort();
  }, []);

  // S&P 500 subsectors derived from backend sector returns
  const subsectors = React.useMemo(() => {
    if (!Array.isArray(sectorReturns) || sectorReturns.length === 0) return [];
    return sectorReturns.map(s => ({
      asset: s.sector,
      y1: Number(s.y1),
      y3: Number(s.y3),
      y5: Number(s.y5),
    }));
  }, [sectorReturns]);
  const [subChecked, setSubChecked] = React.useState([]);
  React.useEffect(() => {
    setSubChecked(Array(subsectors.length).fill(true));
  }, [subsectors.length]);
  const isStockMarketChecked = subChecked.every(Boolean);

  // Selection logic
  const handleCheck = (idx) => {
    if (assetPerformanceData[idx].asset === 'US Stock Market (S&P 500)') {
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

  const handleCreatePortfolio = async ({ checked, subChecked }) => {
    try {
      setLoading(true);
      // Determine selected S&P 500 sectors
      const selectedSectors = subsectors
        .filter((_, idx) => subChecked[idx])
        .map(s => s.asset);

      const res = await fetch(`${API_BASE}/model/train_by_sectors/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectors: selectedSectors }),
      });
      if (!res.ok) throw new Error('Training request failed');
      const result = await res.json();

      setPortfolioData({ result });
      setShowPortfolio(true);
      setActiveSegment(3);
    } catch (err) {
      console.error('CreatePortfolio error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRowVals = (row) => {
    if (row.asset === 'US Stock Market (S&P 500)' && sp500Averages) {
      return sp500Averages;
    }
    return { y1: row.y1, y3: row.y3, y5: row.y5 };
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2vw' }}>
      <DashboardHeader />
      <SegmentedControl segments={segments} active={activeSegment} onChange={setActiveSegment} />
      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(34,34,59,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '2rem',
            boxShadow: '0 2px 24px rgba(30,41,59,0.12)',
            padding: '2.5rem 3rem',
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.2s linear infinite' }}>
                <circle cx="32" cy="32" r="28" stroke="#6366f1" strokeWidth="8" strokeDasharray="44 44" strokeDashoffset="0" />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </svg>
            </div>
            <div style={{ fontSize: '1.3rem', color: '#22223b', fontWeight: 600, fontFamily: 'Poppins, Inter, sans-serif' }}>
              Training model and generating portfolio weights...
            </div>
          </div>
        </div>
      )}
      {/* ...existing code... */}
      {activeSegment === 3 ? (
        !loading ? (
          <PortfolioResults result={portfolioData?.result} />
        ) : null
      ) : activeSegment === 0 ? (
        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', background: '#f3f4f6', borderRadius: '2rem', boxShadow: '0 2px 8px rgba(30,41,59,0.04)', minHeight: '50vh', alignItems: 'stretch' }}>
          <div style={{ flex: '1 1 0', minWidth: '300px', maxWidth: '100%', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%', boxSizing: 'border-box' }}>
            {/* Placeholder for chart */}
            <div style={{ width: '100%', height: '100%', background: '#f3f4f6', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', fontWeight: 600, fontSize: '1.1rem' }}>
              [Chart Area]
            </div>
          </div>
          <div style={{ flex: '1 1 0', minWidth: '300px', maxWidth: '100%', width: '50%', boxSizing: 'border-box', overflowX: 'visible' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem', color: '#22223b' }}>
              Asset Class Performance
            </h2>
            <AssetPerformanceTable
              data={assetPerformanceData}
              checked={checked}
              handleCheck={handleCheck}
              onCreatePortfolio={handleCreatePortfolio}
              subsectors={subsectors}
              subChecked={subChecked}
              setSubChecked={setSubChecked}
            />
          </div>
        </div>
      ) : activeSegment === 1 ? (
        // S&P 500 Stocks tab content (reuse your S&P 500 table and chart layout)
        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', background: '#f3f4f6', borderRadius: '2rem', boxShadow: '0 2px 8px rgba(30,41,59,0.04)', minHeight: '50vh', alignItems: 'stretch', padding: '2rem' }}>
          <div style={{ flex: '1 1 0', minWidth: '300px', maxWidth: '100%', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', height: '100%', background: '#f3f4f6', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', fontWeight: 600, fontSize: '1.1rem' }}>
              [Chart Area]
            </div>
          </div>
          <div style={{ flex: '1 1 0', minWidth: '300px', maxWidth: '100%', width: '50%', boxSizing: 'border-box', overflowX: 'visible' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem', color: '#22223b' }}>
              S&P 500 Sectors
            </h2>
            <SP500StocksTable subsectors={subsectors} subChecked={subChecked} handleSubCheck={handleSubCheck} />
          </div>
        </div>
      ) : (
        <TemplatesPage />
      )}
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
        }
      `}</style>
    </div>
  );
}

export default DashboardDemo;