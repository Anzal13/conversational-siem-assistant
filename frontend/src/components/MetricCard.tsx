import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  variant?: 'default' | 'primary' | 'warning' | 'critical' | 'success';
}

const variantClasses = {
  default: 'border-border',
  primary: 'border-primary/30 glow-cyan',
  warning: 'border-warning/30',
  critical: 'border-critical/30 glow-red',
  success: 'border-success/30 glow-green',
};

const iconVariantClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  warning: 'text-warning',
  critical: 'text-critical',
  success: 'text-success',
};

export function MetricCard({ title, value, subtitle, icon, trend, variant = 'default' }: MetricCardProps) {
  return (
    <div className={`bg-card rounded-lg border p-4 transition-all hover:scale-[1.02] ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold font-mono">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-mono ${trend.value >= 0 ? 'text-critical' : 'text-success'}`}>
              {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-md bg-secondary ${iconVariantClasses[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
