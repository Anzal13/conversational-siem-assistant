import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export function AlertBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-critical/40 bg-critical/5 px-4 py-3 animate-slide-in">
      <AlertTriangle className="h-5 w-5 text-critical animate-blink-critical shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-critical">Active Threat Detected</p>
        <p className="text-xs text-muted-foreground">DDoS attack pattern identified targeting subnet 10.0.2.x — Isolation Forest anomaly score: 0.94</p>
      </div>
      <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
