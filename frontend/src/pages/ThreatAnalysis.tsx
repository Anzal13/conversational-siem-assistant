import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import { getAttackDistribution, generateIncidents } from '@/lib/mock-data';
import { Upload } from 'lucide-react';

const chartTooltip = {
  contentStyle: { backgroundColor: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: 'hsl(210,40%,92%)' },
};

export default function ThreatAnalysis() {
  const attacks = getAttackDistribution();
  const [incidents] = useState(generateIncidents(100));
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Attack types bar chart data
  const barData = attacks.map((a) => ({ ...a, count: a.value * 3 + Math.floor(Math.random() * 20) }));

  // Radar data for ML model performance
  const radarData = [
    { metric: 'Precision', rf: 94, if: 88 },
    { metric: 'Recall', rf: 91, if: 85 },
    { metric: 'F1-Score', rf: 92, if: 86 },
    { metric: 'Accuracy', rf: 96, if: 90 },
    { metric: 'AUC-ROC', rf: 95, if: 89 },
    { metric: 'Speed', rf: 78, if: 95 },
  ];

  // Scatter data: anomaly score vs RF confidence
  const scatterData = incidents.map((inc) => ({
    anomalyScore: inc.anomalyScore,
    rfConfidence: inc.rfConfidence,
    severity: inc.severity,
  }));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus(`Processing ${file.name}...`);
      setTimeout(() => setUploadStatus(`✓ ${file.name} analyzed — ${Math.floor(50 + Math.random() * 200)} threats detected`), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow-cyan">Threat Analysis</h1>
        <p className="text-sm text-muted-foreground">ML-powered threat classification and anomaly detection</p>
      </div>

      {/* CSV Upload */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-mono">Upload Dataset (CSV)</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
          </label>
          {uploadStatus && (
            <span className={`text-sm font-mono ${uploadStatus.startsWith('✓') ? 'text-success' : 'text-warning animate-pulse-slow'}`}>
              {uploadStatus}
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Attack Types Bar */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold mb-4">Attack Types (Random Forest Classification)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ML Performance Radar */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold mb-4">ML Model Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222,30%,18%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: 'hsl(215,20%,55%)' }} domain={[0, 100]} />
              <Radar name="Random Forest" dataKey="rf" stroke="hsl(187,100%,50%)" fill="hsl(187,100%,50%)" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Isolation Forest" dataKey="if" stroke="hsl(142,70%,45%)" fill="hsl(142,70%,45%)" fillOpacity={0.2} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip {...chartTooltip} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scatter: Anomaly vs Confidence */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold mb-4">Anomaly Score vs RF Confidence (per incident)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
            <XAxis dataKey="anomalyScore" name="Anomaly Score" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
            <YAxis dataKey="rfConfidence" name="RF Confidence" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} domain={[0.7, 1]} />
            <ZAxis range={[30, 30]} />
            <Tooltip {...chartTooltip} />
            <Scatter name="Incidents" data={scatterData} fill="hsl(187,100%,50%)" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
