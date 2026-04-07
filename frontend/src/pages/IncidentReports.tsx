import { useState, useMemo } from 'react';
import { generateIncidents, type Incident, type Severity } from '@/lib/mock-data';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Download, Search, Filter } from 'lucide-react';

export default function IncidentReports() {
  const [incidents] = useState(() => generateIncidents(50));
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch = search === '' ||
        inc.id.toLowerCase().includes(search.toLowerCase()) ||
        inc.attackType.toLowerCase().includes(search.toLowerCase()) ||
        inc.sourceIp.includes(search);
      const matchSeverity = severityFilter === 'All' || inc.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || inc.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [incidents, search, severityFilter, statusFilter]);

  const exportCSV = () => {
    const header = 'ID,Timestamp,Source IP,Dest IP,Attack Type,Severity,Anomaly Score,RF Confidence,Status\n';
    const rows = filtered.map((i) =>
      `${i.id},${i.timestamp},${i.sourceIp},${i.destIp},${i.attackType},${i.severity},${i.anomalyScore},${i.rfConfidence},${i.status}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'incident_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-glow-cyan">Incident Reports</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} incidents found</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-colors">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, type, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as Severity | 'All')}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground bg-secondary/50">
              <th className="text-left py-3 px-3">ID</th>
              <th className="text-left py-3 px-3">Timestamp</th>
              <th className="text-left py-3 px-3">Source IP</th>
              <th className="text-left py-3 px-3">Dest IP</th>
              <th className="text-left py-3 px-3">Attack Type</th>
              <th className="text-left py-3 px-3">Severity</th>
              <th className="text-left py-3 px-3">Anomaly</th>
              <th className="text-left py-3 px-3">RF Conf.</th>
              <th className="text-left py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inc) => (
              <tr key={inc.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                <td className="py-2.5 px-3 text-primary">{inc.id}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{new Date(inc.timestamp).toLocaleString()}</td>
                <td className="py-2.5 px-3">{inc.sourceIp}</td>
                <td className="py-2.5 px-3">{inc.destIp}</td>
                <td className="py-2.5 px-3">{inc.attackType}</td>
                <td className="py-2.5 px-3"><SeverityBadge severity={inc.severity} /></td>
                <td className="py-2.5 px-3">{inc.anomalyScore}</td>
                <td className="py-2.5 px-3">{inc.rfConfidence}</td>
                <td className="py-2.5 px-3">
                  <span className={`text-xs ${inc.status === 'Open' ? 'text-warning' : inc.status === 'Investigating' ? 'text-info' : 'text-success'}`}>
                    {inc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
