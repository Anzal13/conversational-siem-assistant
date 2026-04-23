import { useEffect, useState } from 'react';
import { Activity, Shield, AlertTriangle, Server, Zap, Lock, Brain, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MetricCard } from '@/components/MetricCard';
import { AlertBanner } from '@/components/AlertBanner';
import { SeverityBadge } from '@/components/SeverityBadge';
import { generateTrafficData, getAttackDistribution, generateIncidents } from '@/lib/mock-data';

export default function Overview() {
  const [metrics, setMetrics] = useState<any>({});
  const [traffic] = useState(generateTrafficData(24));
  const attacks = getAttackDistribution();
  const [incidents] = useState(generateIncidents(5));

  useEffect(() => {
  fetch("http://127.0.0.1:8000/dashboard")
    .then(res => res.json())
    .then(data => {
      console.log("FIRST FETCH:", data);   // ✅ ADD THIS
      setMetrics(data);
    });

  const interval = setInterval(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then(res => res.json())
      .then(data => {
        console.log("INTERVAL FETCH:", data);  // ✅ ADD THIS
        setMetrics(data);
      });
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const chartTooltipStyle = {
    contentStyle: { backgroundColor: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: '8px', fontSize: '12px' },
    labelStyle: { color: 'hsl(210,40%,92%)' },
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-glow-cyan">Security Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time threat intelligence powered by Random Forest & Isolation Forest ML
        </p>
      </div>

      <AlertBanner />

      {/* Metrics Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Traffic" 
          value={(metrics.total_traffic || 0).toLocaleString()} 
          icon={<Activity className="h-5 w-5" />} 
          variant="primary" 
          trend={{ value: 12, label: 'vs last hour' }} 
        />

        <MetricCard 
          title="Detected Threats" 
          value={metrics.threats || 0} 
          icon={<Shield className="h-5 w-5" />} 
          variant="critical" 
          trend={{ value: 8, label: 'vs last hour' }} 
        />

        <MetricCard 
          title="Anomaly Score" 
          value={metrics.anomaly_score || 0} 
          subtitle="Isolation Forest avg" 
          icon={<Brain className="h-5 w-5" />} 
          variant="warning" 
        />

        <MetricCard 
          title="System Uptime" 
          value={`99.9%`} 
          icon={<Server className="h-5 w-5" />} 
          variant="success" 
        />
      </div>

      {/* Metrics Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Alerts" 
          value={metrics.alerts || 0} 
          icon={<AlertTriangle className="h-5 w-5" />} 
          variant="warning" 
        />

        <MetricCard 
          title="Blocked Attacks" 
          value={(metrics.blocked || 0).toLocaleString()} 
          icon={<Lock className="h-5 w-5" />} 
          variant="success" 
        />

        <MetricCard 
          title="ML Accuracy" 
          value={`${metrics.accuracy || 0}%`} 
          subtitle="RF + IF combined" 
          icon={<Zap className="h-5 w-5" />} 
          variant="primary" 
        />

        <MetricCard 
          title="Avg Response" 
          value={`12ms`} 
          icon={<Clock className="h-5 w-5" />} 
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold mb-4">Network Traffic (24h)</h3>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={traffic}>
              <defs>
                <linearGradient id="gNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(187,100%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(187,100%,50%)" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="gSuspicious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38,92%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="gMalicious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0,84%,60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0,84%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
              <Tooltip {...chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />

              <Area type="monotone" dataKey="normal" stroke="hsl(187,100%,50%)" fill="url(#gNormal)" strokeWidth={2} />
              <Area type="monotone" dataKey="suspicious" stroke="hsl(38,92%,50%)" fill="url(#gSuspicious)" strokeWidth={2} />
              <Area type="monotone" dataKey="malicious" stroke="hsl(0,84%,60%)" fill="url(#gMalicious)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold mb-4">Attack Distribution</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={attacks} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={90} 
                innerRadius={50} 
                paddingAngle={2} 
                strokeWidth={0}
              >
                {attacks.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip {...chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold mb-4">Recent Incidents</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2">ID</th>
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Source</th>
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-left py-2 px-2">Severity</th>
                <th className="text-left py-2 px-2">Score</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-2 px-2 text-primary">{inc.id}</td>
                  <td className="py-2 px-2 text-muted-foreground">{new Date(inc.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 px-2">{inc.sourceIp}</td>
                  <td className="py-2 px-2">{inc.attackType}</td>
                  <td className="py-2 px-2"><SeverityBadge severity={inc.severity} /></td>
                  <td className="py-2 px-2">{inc.anomalyScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
