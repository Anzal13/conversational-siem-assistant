export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  attackType: string;
  severity: Severity;
  anomalyScore: number;
  rfConfidence: number;
  status: 'Open' | 'Investigating' | 'Resolved';
  description: string;
}

export interface TrafficPoint {
  time: string;
  normal: number;
  suspicious: number;
  malicious: number;
}

export interface AttackDistribution {
  name: string;
  value: number;
  color: string;
}

const ATTACK_TYPES = [
  'DDoS', 'SQL Injection', 'XSS', 'Brute Force', 'Port Scan',
  'Malware', 'Phishing', 'Man-in-the-Middle', 'Zero-Day Exploit', 'Ransomware'
];

const SEVERITIES: Severity[] = ['Low', 'Medium', 'High', 'Critical'];

const randomIp = () =>
  `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const randomId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export function generateIncident(date?: Date): Incident {
  const d = date || new Date(Date.now() - Math.random() * 86400000 * 7);
  const attackType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
  const anomalyScore = Math.random();
  const severity: Severity = anomalyScore > 0.85 ? 'Critical' : anomalyScore > 0.65 ? 'High' : anomalyScore > 0.4 ? 'Medium' : 'Low';
  return {
    id: `INC-${randomId()}`,
    timestamp: d.toISOString(),
    sourceIp: randomIp(),
    destIp: randomIp(),
    attackType,
    severity,
    anomalyScore: parseFloat(anomalyScore.toFixed(3)),
    rfConfidence: parseFloat((0.7 + Math.random() * 0.29).toFixed(3)),
    status: Math.random() > 0.6 ? 'Open' : Math.random() > 0.5 ? 'Investigating' : 'Resolved',
    description: `${attackType} detected from ${randomIp()} targeting internal network segment.`,
  };
}

export function generateIncidents(count: number): Incident[] {
  return Array.from({ length: count }, () => generateIncident());
}

export function generateTrafficData(hours: number = 24): TrafficPoint[] {
  const data: TrafficPoint[] = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    data.push({
      time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      normal: Math.floor(800 + Math.random() * 400 + Math.sin(i / 3) * 200),
      suspicious: Math.floor(50 + Math.random() * 80 + Math.sin(i / 2) * 30),
      malicious: Math.floor(5 + Math.random() * 25),
    });
  }
  return data;
}

export function getAttackDistribution(): AttackDistribution[] {
  return [
    { name: 'DDoS', value: 35, color: 'hsl(0, 84%, 60%)' },
    { name: 'SQL Injection', value: 20, color: 'hsl(38, 92%, 50%)' },
    { name: 'XSS', value: 15, color: 'hsl(187, 100%, 50%)' },
    { name: 'Brute Force', value: 12, color: 'hsl(142, 70%, 45%)' },
    { name: 'Port Scan', value: 8, color: 'hsl(270, 70%, 60%)' },
    { name: 'Malware', value: 5, color: 'hsl(330, 80%, 55%)' },
    { name: 'Other', value: 5, color: 'hsl(215, 20%, 55%)' },
  ];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  source: string;
  message: string;
}

export function generateLogEntry(): LogEntry {
  const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'WARN', 'WARN', 'ERROR', 'CRITICAL'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const sources = ['Firewall', 'IDS', 'WAF', 'Endpoint', 'DNS', 'DHCP', 'Auth-Server', 'Proxy'];
  const messages: Record<LogEntry['level'], string[]> = {
    INFO: [
      'Connection established successfully',
      'Routine scan completed - no threats detected',
      'Certificate renewed for endpoint',
      'User authentication successful',
    ],
    WARN: [
      'Multiple failed login attempts detected',
      'Unusual outbound traffic pattern observed',
      'SSL certificate expiring in 7 days',
      'High memory usage on monitoring node',
    ],
    ERROR: [
      'Blocked suspicious payload from external source',
      'Intrusion attempt detected and quarantined',
      'Malformed packet dropped at gateway',
      'Rate limit exceeded for API endpoint',
    ],
    CRITICAL: [
      'ACTIVE THREAT: DDoS attack in progress',
      'BREACH DETECTED: Unauthorized data exfiltration',
      'CRITICAL: Ransomware signature identified',
      'ZERO-DAY: Unknown exploit targeting CVE-2024-XXXX',
    ],
  };
  const msgs = messages[level];
  return {
    id: randomId(),
    timestamp: new Date().toISOString(),
    level,
    source: sources[Math.floor(Math.random() * sources.length)],
    message: msgs[Math.floor(Math.random() * msgs.length)],
  };
}

export function getMetrics() {
  return {
    totalTraffic: Math.floor(1200000 + Math.random() * 300000),
    detectedThreats: Math.floor(150 + Math.random() * 80),
    avgAnomalyScore: parseFloat((0.3 + Math.random() * 0.2).toFixed(2)),
    systemUptime: 99.97,
    activeAlerts: Math.floor(5 + Math.random() * 15),
    blockedAttacks: Math.floor(2000 + Math.random() * 500),
    mlAccuracy: parseFloat((94 + Math.random() * 4).toFixed(1)),
    responseTime: Math.floor(12 + Math.random() * 8),
  };
}
