import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

export default function SiemSettings() {
  const [settings, setSettings] = useState({
    anomalyThreshold: 0.75,
    rfThreshold: 0.85,
    refreshRate: 5,
    maxLogs: 500,
    emailAlerts: true,
    criticalOnly: false,
    darkMode: true,
  });

  const update = (key: string, value: any) => setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-glow-cyan">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure detection thresholds and system preferences</p>
      </div>

      <div className="space-y-4">
        {/* ML Settings */}
        <div className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-primary">ML Pipeline Configuration</h3>
          
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Isolation Forest Anomaly Threshold</span>
              <span className="text-sm font-mono text-primary">{settings.anomalyThreshold}</span>
            </label>
            <input type="range" min="0" max="1" step="0.05" value={settings.anomalyThreshold} onChange={(e) => update('anomalyThreshold', parseFloat(e.target.value))}
              className="w-full accent-primary" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Random Forest Confidence Threshold</span>
              <span className="text-sm font-mono text-primary">{settings.rfThreshold}</span>
            </label>
            <input type="range" min="0.5" max="1" step="0.05" value={settings.rfThreshold} onChange={(e) => update('rfThreshold', parseFloat(e.target.value))}
              className="w-full accent-primary" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Refresh Rate (seconds)</span>
              <span className="text-sm font-mono text-primary">{settings.refreshRate}s</span>
            </label>
            <input type="range" min="1" max="30" step="1" value={settings.refreshRate} onChange={(e) => update('refreshRate', parseInt(e.target.value))}
              className="w-full accent-primary" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Log Buffer Size</span>
              <span className="text-sm font-mono text-primary">{settings.maxLogs}</span>
            </label>
            <input type="range" min="100" max="2000" step="100" value={settings.maxLogs} onChange={(e) => update('maxLogs', parseInt(e.target.value))}
              className="w-full accent-primary" />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-primary">Notifications</h3>
          
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-muted-foreground">Email Alerts</span>
            <div className={`w-10 h-5 rounded-full transition-colors ${settings.emailAlerts ? 'bg-primary' : 'bg-secondary'} relative cursor-pointer`}
              onClick={() => update('emailAlerts', !settings.emailAlerts)}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${settings.emailAlerts ? 'left-5' : 'left-0.5'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-muted-foreground">Critical Alerts Only</span>
            <div className={`w-10 h-5 rounded-full transition-colors ${settings.criticalOnly ? 'bg-primary' : 'bg-secondary'} relative cursor-pointer`}
              onClick={() => update('criticalOnly', !settings.criticalOnly)}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${settings.criticalOnly ? 'left-5' : 'left-0.5'}`} />
            </div>
          </label>
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors glow-cyan">
          <Save className="h-4 w-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
}
