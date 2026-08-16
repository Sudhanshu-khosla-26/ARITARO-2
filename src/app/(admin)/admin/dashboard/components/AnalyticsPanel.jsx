"use client";

const STATUS_LABELS = {
  submitted: "Submitted",
  under_review: "Under review",
  in_progress: "In progress",
  report_delivered: "Delivered",
  client_review: "Client review",
  closed: "Closed",
};

const SERVICE_LABELS = {
  api_pt: "API pentest",
  wap_pt: "Web app",
  cloud_security: "Cloud",
  ai_pt: "AI security",
};

function EmptyState({ children = "No request activity yet" }) {
  return <div className="dash-empty-state">{children}</div>;
}

function TrendChart({ data = [] }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  const points = data.map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${90 - (item.count / max) * 68}`).join(" ");
  return (
    <div className="dash-chart-wrap">
      {data.length ? (
        <>
          <svg className="dash-trend-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Service requests over the last six months">
            <defs><linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
            <path d={`M 0 90 L ${points} L 100 90 Z`} fill="url(#trendFill)" />
            <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="dash-chart-labels">{data.map((item) => <span key={item.label}>{item.label}<b>{item.count}</b></span>)}</div>
        </>
      ) : <EmptyState />}
    </div>
  );
}

function Breakdown({ items = [], labels }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return items.length ? <div className="dash-breakdown">{items.slice(0, 5).map((item) => <div className="dash-breakdown-row" key={item.label}><div className="dash-breakdown-meta"><span>{labels[item.label] || item.label}</span><b>{item.count}</b></div><div className="dash-bar"><i style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} /></div></div>)}</div> : <EmptyState />;
}

export default function AnalyticsPanel({ stats }) {
  return (
    <section className="dash-analytics-grid dash-animate dash-animate-5">
      <div className="dash-panel dash-chart-panel">
        <div className="dash-panel-header"><div><span className="dash-eyebrow">Activity pulse</span><h2 className="dash-panel-title">Requests over time</h2></div><span className="dash-panel-note">Last 6 months</span></div>
        <TrendChart data={stats?.trend} />
      </div>
      <div className="dash-panel"><div className="dash-panel-header"><div><span className="dash-eyebrow">Workflow</span><h2 className="dash-panel-title">Request status</h2></div></div><Breakdown items={stats?.statusBreakdown} labels={STATUS_LABELS} /></div>
      <div className="dash-panel"><div className="dash-panel-header"><div><span className="dash-eyebrow">Portfolio mix</span><h2 className="dash-panel-title">Service types</h2></div></div><Breakdown items={stats?.serviceBreakdown} labels={SERVICE_LABELS} /></div>
    </section>
  );
}

export { STATUS_LABELS, SERVICE_LABELS }; 
