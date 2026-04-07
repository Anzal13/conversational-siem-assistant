import type { Severity } from '@/lib/mock-data';

const classes: Record<Severity, string> = {
  Low: 'bg-info/10 text-info border-info/30',
  Medium: 'bg-warning/10 text-warning border-warning/30',
  High: 'bg-destructive/10 text-destructive border-destructive/30',
  Critical: 'bg-critical/10 text-critical border-critical/30 animate-pulse-slow',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${classes[severity]}`}>
      {severity === 'Critical' && <span className="h-1.5 w-1.5 rounded-full bg-critical mr-1 animate-blink-critical" />}
      {severity}
    </span>
  );
}
