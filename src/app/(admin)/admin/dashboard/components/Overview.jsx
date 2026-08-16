import Link from "next/link";
import AnalyticsPanel from "./AnalyticsPanel";

const statCards = [
  ["Admins", "adminCount", "Access control"],
  ["Companies", "clientCount", "Active accounts"],
  ["Contact requests", "contactCount", "Inbound interest"],
  ["Service requests", "requestCount", "Total pipeline"],
];

export default function Overview({ stats, loading, setActiveTab }) {
  return (
    <div className="dash-overview">
      <header className="dash-header dash-animate dash-animate-1">
        <div className="dash-header-left"><span className="dash-eyebrow">Operations cockpit</span><h1>Good morning, {"admin"}.</h1><p>Here&apos;s the latest signal across your security delivery pipeline.</p></div>
        <div className="dash-header-actions"><span className="dash-live-pill"><i /> Live data</span><Link href="/" className="dash-btn-outline">View homepage</Link></div>
      </header>

      <section className="dash-stats">
        {statCards.map(([label, key, note], index) => <article className={`dash-stat-card dash-animate dash-animate-${index + 2}`} key={key}><div className="dash-stat-top"><span className="dash-stat-kicker">{note}</span><span className="dash-stat-orb" /></div><strong>{loading ? "…" : stats?.[key] ?? 0}</strong><span>{label}</span></article>)}
      </section>

      <AnalyticsPanel stats={stats} />

      <section className="dash-bottom-grid dash-animate dash-animate-6">
        <div className="dash-panel dash-activity-panel"><div className="dash-panel-header"><div><span className="dash-eyebrow">Latest movement</span><h2 className="dash-panel-title">Recent requests</h2></div><button type="button" className="dash-text-button" onClick={() => setActiveTab("requests")}>View all</button></div>{stats?.recentRequests?.length ? <div className="dash-activity-list">{stats.recentRequests.map((request) => <div className="dash-activity-row" key={request.id}><span className="dash-activity-dot" /><div><b>{request.ticket_ref || "New request"}</b><span>{request.service_type?.replaceAll("_", " ") || "Security service"}</span></div><em>{request.status?.replaceAll("_", " ")}</em></div>)}</div> : <EmptyCopy />}</div>
        <div className="dash-panel dash-action-panel"><span className="dash-eyebrow">Shortcuts</span><h2 className="dash-panel-title">Keep the pipeline moving.</h2><p>Jump into the areas that need your attention today.</p><div className="dash-action-list"><button type="button" onClick={() => setActiveTab("requests")}><span>Track service requests</span><b>→</b></button><button type="button" onClick={() => setActiveTab("users")}><span>Manage users and access</span><b>→</b></button><Link href="/" className="dash-btn-primary">Open public site</Link></div></div>
      </section>
    </div>
  );
}

function EmptyCopy() { return <div className="dash-empty-state">No recent requests to display.</div>; }
