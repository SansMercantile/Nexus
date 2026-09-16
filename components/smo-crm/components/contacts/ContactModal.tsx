import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ContactType, ContactStatus, WorkspaceSpace } from '../../types';

export const ContactModal: React.FC = () => {
  const { 
    isContactModalOpen, 
    setIsContactModalOpen, 
    addContact, 
    teamMembers, 
    currentSpace 
  } = useCrm();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ContactType>('investor');
  const [status, setStatus] = useState<ContactStatus>('evaluating');
  const [space, setSpace] = useState<WorkspaceSpace>('CBDO workspace');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !organization.trim() || !email.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addContact({
      name: name.trim(),
      title: title.trim() || 'Principal',
      organization: organization.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      type,
      status,
      space,
      assignedTo: assignedTo || teamMembers[0]?.id || 'user-mezzoforte',
      totalDealsValue: 0,
      lastContacted: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
      tags,
    });

    setIsContactModalOpen(false);
  };

  return (
    <div 
      id="smo-contact-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsContactModalOpen(false)}
    >
      <div 
        id="smo-contact-modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Counterparty Contact</h2>
              <p className="text-[11px] text-slate-500">Investor, Grant Sponsor or Commercial Client</p>
            </div>
          </div>
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Vivienne De Vries"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Job Title / Role</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Managing Director / Jury Lead"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Organization / Fund *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="e.g. Meridian Apex Capital"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@company.com"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact Category</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContactType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="investor">Investor / VC</option>
                <option value="grant_sponsor">Grant Sponsor / Jury</option>
                <option value="enterprise_client">Enterprise Client</option>
                <option value="strategic_partner">Strategic Partner</option>
                <option value="advisor">Advisor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Relationship Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ContactStatus)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="evaluating">Evaluating</option>
                <option value="negotiating">Negotiating</option>
                <option value="portfolio">Portfolio</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Workspace Space</label>
              <select
                value={space}
                onChange={e => setSpace(e.target.value as WorkspaceSpace)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="CBDO workspace">CBDO workspace</option>
                <option value="Sovereign Command">Sovereign Command</option>
                <option value="PR & Comms">PR & Comms</option>
                <option value="Mpeti">Mpeti</option>
                <option value="CrazyJam Records">CrazyJam Records</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Assigned Team Member</label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA / London, UK"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Diligence & Background Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes on strategic relevance, investor preferences, past deals..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-18 resize-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Series A, Lead Partner, High Net Worth"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
