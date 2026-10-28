import React, { useRef } from 'react';
import {
  Shield,
  Edit3,
  Plus,
  LayoutDashboard,
  Download,
  Upload,
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminQuickBarProps {
  isCloudConnected: boolean;
  quickEditMode: boolean;
  onToggleQuickEdit: () => void;
  onOpenAddProduct: () => void;
  onOpenAddLandingPage: () => void;
  onOpenDashboard: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onLogout: () => void;
}

export const AdminQuickBar: React.FC<AdminQuickBarProps> = ({
  isCloudConnected,
  quickEditMode,
  onToggleQuickEdit,
  onOpenAddProduct,
  onOpenAddLandingPage,
  onOpenDashboard,
  onExportBackup,
  onImportBackup,
  onLogout
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <aside aria-label="Admin Quick Bar" className="bg-slate-900 text-white border-b border-slate-800 text-xs px-3 sm:px-6 py-2 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Branding & Database Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-black text-emerald-400">
            <Shield className="w-4 h-4" />
            <span className="tracking-wide uppercase text-[11px]">ToolzAi Admin</span>
          </div>

          <div className="h-3.5 w-px bg-slate-700 hidden sm:block" />

          {/* Cloud Database Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-800 border border-slate-700">
            <Database className="w-3 h-3 text-cyan-400" />
            {isCloudConnected ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Supabase Live
              </span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Local Mode
              </span>
            )}
          </div>

          {/* Quick Edit Mode Toggle Switch */}
          <button
            onClick={onToggleQuickEdit}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-sm ${
              quickEditMode
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Quick Edit Mode: {quickEditMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
            title="Post a new product immediately"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Product</span>
          </button>

          <button
            onClick={onOpenAddLandingPage}
            className="hidden sm:flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
            title="Create a custom landing page campaign"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Campaign</span>
          </button>

          <button
            onClick={onExportBackup}
            className="hidden md:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
            title="Download full JSON store backup"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backup</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden md:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
            title="Restore store data from JSON file"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Restore</span>
          </button>

          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-300 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
            title="Logout from Admin"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>

      </div>
    </aside>
  );
};
