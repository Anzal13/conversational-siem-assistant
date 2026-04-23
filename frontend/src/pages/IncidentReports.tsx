import { useEffect, useState } from "react";

export default function IncidentReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/reports")
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-glow-cyan">
        Incident Reports
      </h1>

      <div className="bg-card rounded-lg border border-border p-4">
        {reports.length === 0 ? (
          <p>No reports yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="p-2">Status</th>
                <th className="p-2">Severity</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2 text-green-400">{r.status}</td>
                  <td className="p-2 text-red-400">{r.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}