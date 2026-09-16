import React from 'react';
import { ShieldAlert, Lock, UserCheck, ArrowRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { DEPARTMENTS } from '../../data/departmentsData';

interface GatedAccessBannerProps {
  moduleName: string;
  requiredDepartments: string[];
}

export const GatedAccessBanner: React.FC<GatedAccessBannerProps> = ({ 
  moduleName, 
  requiredDepartments 
}) => {
  const { currentUser, switchUser, setActiveTab } = useCrm();
  const currentDept = DEPARTMENTS[currentUser.department];

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <Lock className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          Department Access Gated
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1.5">
          {moduleName} Clearance Required
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed mb-5">
          You are currently viewing the CRM as <span className="font-semibold text-slate-800">{currentUser.name}</span> in the <span className="font-semibold text-slate-800">{currentDept.name}</span> department. This module is restricted to {requiredDepartments.join(' & ')}.
        </p>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-left text-xs mb-5 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Active Permissions</div>
          <div className="text-slate-700 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Accessible: {currentDept.accessibleTabs.map(t => t.toUpperCase()).join(', ')}</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Departments can collaborate across silos anytime using the <button onClick={() => setActiveTab('chat')} className="text-indigo-600 font-semibold underline">Team Chat</button>.
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => switchUser('user-mezzoforte')}
            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Switch to Sovereign Admin (Mezzoforte Privilege)
          </button>
          
          <button
            onClick={() => setActiveTab('chat')}
            className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Go to Inter-Department Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
