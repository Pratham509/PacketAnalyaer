"use client";

import { useState } from "react";
import { UploadCloud, Activity, ShieldAlert, CheckCircle, Database, Network } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000");
  const [error, setError] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed. Check backend connection.");
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 lg:p-12">
      <header className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
          <Activity className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Deep Packet Inspection
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Upload a Wireshark PCAP file to analyze application traffic, extract SNI domains, and view flow statistics.
        </p>
      </header>

      {/* Settings & Upload */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="glass-panel rounded-3xl p-8 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Backend Connection</h2>
          <label className="text-sm text-slate-400 mb-2 block">API URL</label>
          <input 
            type="text" 
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            placeholder="https://your-backend.onrender.com"
          />
          <p className="text-xs text-slate-500 mt-3">
            Ensure your FastAPI backend is running. Use localhost for testing.
          </p>
        </div>

        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="glass-panel rounded-3xl p-8 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden"
        >
          <input 
            type="file" 
            accept=".pcap" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <div className="bg-slate-800/50 p-4 rounded-full mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-1">
            {file ? file.name : "Drag & Drop PCAP file"}
          </h3>
          <p className="text-sm text-slate-500">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse"}
          </p>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={!file || loading}
            className="mt-6 w-full relative z-20 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Analyzing Packets...</span>
            ) : (
              "Run DPI Engine"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Results Dashboard */}
      {report && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Database />} label="Total Packets" value={report.total_packets.toLocaleString()} />
            <StatCard icon={<Network />} label="Total Volume" value={`${(report.total_bytes / 1024).toFixed(1)} KB`} />
            <StatCard icon={<CheckCircle className="text-emerald-400"/>} label="Forwarded" value={report.forwarded.toLocaleString()} />
            <StatCard icon={<ShieldAlert className="text-rose-400"/>} label="Dropped" value={report.dropped.toLocaleString()} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-slate-200">Application Breakdown</h3>
              <div className="space-y-5">
                {report.applications.map((app: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-300">{app.name}</span>
                      <span className="text-slate-400">{app.count} pkts ({app.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${app.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-slate-200">Extracted SNI Domains</h3>
              <div className="space-y-3">
                {report.detected_domains.length === 0 && (
                  <p className="text-slate-500 text-sm">No domains extracted from this capture.</p>
                )}
                {report.detected_domains.map((dom: any, i: number) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                    <span className="font-mono text-sm text-cyan-300">{dom.domain}</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">
                      {dom.app}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 hover:bg-slate-800/40 transition-colors">
      <div className="p-3 bg-slate-800 rounded-2xl text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
}
