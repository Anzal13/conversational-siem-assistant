import { useEffect, useRef, useState } from 'react';
import { generateLogEntry, type LogEntry } from '@/lib/mock-data';
import { Pause, Play, Trash2 } from 'lucide-react';

const levelColors: Record<LogEntry['level'], string> = {
  INFO: 'text-info',
  WARN: 'text-warning',
  ERROR: 'text-destructive',
  CRITICAL: 'text-critical animate-blink-critical',
};

export default function LiveMonitoring() {
  const [logs, setLogs] = useState<LogEntry[]>(() => Array.from({ length: 30 }, generateLogEntry));
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<LogEntry['level'] | 'ALL'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      setLogs((prev) => [...prev.slice(-200), generateLogEntry()]);
    }, 800);
    return () => clearInterval(iv);
  }, [paused]);

  useEffect(() => {
    if (scrollRef.current && !paused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, paused]);

  const filtered = filter === 'ALL' ? logs : logs.filter((l) => l.level === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-glow-cyan">Live Monitoring</h1>
          <p className="text-sm text-muted-foreground">Real-time network traffic log feed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${paused ? 'bg-warning' : 'bg-success animate-pulse-slow'}`} />
            <span className="text-xs font-mono text-muted-foreground">{paused ? 'PAUSED' : 'LIVE'}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              filter === level ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {level}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setPaused(!paused)} className="p-2 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <button onClick={() => setLogs([])} className="p-2 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Log feed */}
      <div ref={scrollRef} className="bg-card rounded-lg border border-border p-4 h-[calc(100vh-240px)] overflow-auto font-mono text-xs leading-relaxed">
        {filtered.map((log) => (
          <div key={log.id} className="flex gap-3 py-1 hover:bg-secondary/30 px-2 rounded animate-slide-in">
            <span className="text-muted-foreground shrink-0 w-[180px]">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className={`shrink-0 w-[70px] font-bold ${levelColors[log.level]}`}>[{log.level}]</span>
            <span className="text-primary shrink-0 w-[100px]">{log.source}</span>
            <span className="text-foreground">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
