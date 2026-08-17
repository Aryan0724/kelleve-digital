'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { RefreshCcw, Database, HardDrive, Cpu, Activity, AlertTriangle, CheckCircle, XCircle, Terminal } from 'lucide-react';

interface HealthData {
  status: 'healthy' | 'warning' | 'critical';
  data: {
    database: {
      status: string;
      connection?: string;
      pending_migrations?: number;
      error?: string;
    };
    cache: {
      status: string;
      driver?: string;
      error?: string;
    };
    queue: {
      status: string;
      driver?: string;
      failed_jobs?: number;
      error?: string;
    };
    storage: {
      status: string;
      free_space_gb?: number;
      total_space_gb?: number;
      free_percent?: number;
    };
    system: {
      php_version: string;
      laravel_version: string;
      environment: string;
      debug_mode: boolean;
      memory_usage: string;
      cpu_load?: string;
    };
    deployment?: {
      last_deploy: string;
      status: string;
      version: string;
    };
    timestamp: string;
  };
}

export default function SystemHealthPanel() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/system-health');
      setHealth(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await api.get('/admin/system-health/logs');
      if (res.data?.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleRefresh = () => {
    fetchHealth();
    fetchLogs();
  };

  useEffect(() => {
    handleRefresh();
    // Auto-refresh every 30 seconds
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (loading && !health) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        <RefreshCcw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center space-x-4">
        <AlertTriangle className="w-6 h-6" />
        <p><strong>Error connecting to health service:</strong> {error}</p>
        <button onClick={fetchHealth} className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Retry
        </button>
      </div>
    );
  }

  if (!health) return null;

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'healthy') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBg = (status: string) => {
    if (status === 'healthy') return 'bg-emerald-50 border-emerald-100';
    if (status === 'warning') return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Health Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">
            Real-time monitoring of backend infrastructure and services.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 rounded-xl hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center space-x-4 ${getStatusBg(health.status)}`}>
        <StatusIcon status={health.status} />
        <div>
          <h3 className="font-semibold text-slate-900 capitalize">Overall System Status: {health.status}</h3>
          <p className="text-slate-600 text-sm">Last checked: {new Date(health.data.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Database */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <StatusIcon status={health.data.database.status} />
          </div>
          <h4 className="font-semibold text-slate-800">Database (MySQL)</h4>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Status: <span className="capitalize font-medium">{health.data.database.status}</span></p>
            {health.data.database.connection && <p>Connection: {health.data.database.connection}</p>}
            {health.data.database.pending_migrations !== undefined && (
              <p className={health.data.database.pending_migrations > 0 ? 'text-amber-600 font-medium' : ''}>
                Pending Migrations: {health.data.database.pending_migrations}
              </p>
            )}
            {health.data.database.error && <p className="text-red-500 text-xs break-words">{health.data.database.error}</p>}
          </div>
        </div>

        {/* Cache & Queue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <StatusIcon status={health.data.queue.status === 'healthy' && health.data.cache.status === 'healthy' ? 'healthy' : 'warning'} />
          </div>
          <h4 className="font-semibold text-slate-800">Redis (Cache & Queue)</h4>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Cache Status: <span className="capitalize font-medium">{health.data.cache.status}</span></p>
            <p>Queue Status: <span className="capitalize font-medium">{health.data.queue.status}</span></p>
            {health.data.queue.failed_jobs !== undefined && (
              <p className={health.data.queue.failed_jobs > 0 ? 'text-red-600 font-medium' : ''}>
                Failed Jobs: {health.data.queue.failed_jobs}
              </p>
            )}
          </div>
        </div>

        {/* Storage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <HardDrive className="w-6 h-6" />
            </div>
            <StatusIcon status={health.data.storage.status} />
          </div>
          <h4 className="font-semibold text-slate-800">Disk Storage</h4>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Status: <span className="capitalize font-medium">{health.data.storage.status}</span></p>
            {health.data.storage.free_space_gb !== undefined && (
              <>
                <p>Free Space: {health.data.storage.free_space_gb} GB</p>
                <p>Total Space: {health.data.storage.total_space_gb} GB</p>
                
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full ${health.data.storage.free_percent && health.data.storage.free_percent < 15 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${100 - (health.data.storage.free_percent || 0)}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <h4 className="font-semibold text-slate-800">System Details</h4>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Environment: <span className="font-medium">{health.data.system.environment}</span></p>
            <p>PHP Version: {health.data.system.php_version}</p>
            <p>Laravel Version: {health.data.system.laravel_version}</p>
            <p>Memory Usage: {health.data.system.memory_usage}</p>
            {health.data.system.cpu_load && <p>CPU Load: {health.data.system.cpu_load}</p>}
            {health.data.deployment && (
              <>
                <p>Deploy Version: <span className="font-mono text-xs bg-slate-100 px-1 rounded">{health.data.deployment.version || 'Unknown'}</span></p>
                {health.data.deployment.last_deploy && <p>Last Deploy: {new Date(health.data.deployment.last_deploy).toLocaleString()}</p>}
              </>
            )}
            <p className={health.data.system.debug_mode ? 'text-amber-600 font-medium' : ''}>
              Debug Mode: {health.data.system.debug_mode ? 'Enabled (Warning)' : 'Disabled (Safe)'}
            </p>
          </div>
        </div>

      </div>

      {/* Application Logs Viewer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden mt-8">
        <div className="flex justify-between items-center bg-slate-950 px-4 py-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-slate-400" />
            <h3 className="text-slate-200 font-mono text-sm font-semibold">storage/logs/laravel.log</h3>
          </div>
          <button 
            onClick={fetchLogs} 
            disabled={loadingLogs}
            className="text-slate-400 hover:text-white transition disabled:opacity-50"
            title="Refresh Logs"
          >
            <RefreshCcw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="p-4 h-96 overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar">
          {logs.length === 0 && !loadingLogs ? (
            <div className="text-slate-500 italic">No logs found or log file is empty.</div>
          ) : (
            logs.map((line, idx) => {
              // Basic color coding for log lines
              let textColor = 'text-slate-300';
              if (line.includes('local.ERROR') || line.includes('production.ERROR')) {
                textColor = 'text-red-400 font-semibold';
              } else if (line.includes('local.WARNING') || line.includes('production.WARNING')) {
                textColor = 'text-amber-400';
              } else if (line.includes('local.INFO') || line.includes('production.INFO')) {
                textColor = 'text-blue-300';
              }
              
              return (
                <div key={idx} className={`whitespace-pre-wrap break-all border-b border-slate-800/50 pb-1 mb-1 ${textColor}`}>
                  {line}
                </div>
              );
            })
          )}
          {loadingLogs && logs.length === 0 && (
            <div className="text-slate-500 animate-pulse flex items-center gap-2">
              <RefreshCcw className="w-3 h-3 animate-spin" /> Fetching logs...
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
