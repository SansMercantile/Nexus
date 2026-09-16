import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  DollarSign, 
  X,
  MessageSquare
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Contact, ContactType, ContactStatus } from '../../types';

export const ContactsView: React.FC = () => {
  const { 
    contacts, 
    currentSpace, 
    searchQuery, 
    teamMembers, 
    setIsContactModalOpen, 
    deleteContact, 
    updateContact,
    deals 
  } = useCrm();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSpace = currentSpace === 'All Spaces' || contact.space === currentSpace;
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || contact.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

      return matchesSpace && matchesSearch && matchesType && matchesStatus;
    });
  }, [contacts, currentSpace, searchQuery, typeFilter, statusFilter]);

  const getTypeBadge = (type: ContactType) => {
    switch (type) {
      case 'investor':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Investor / VC</span>;
      case 'grant_sponsor':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Grant / Science Award</span>;
      case 'enterprise_client':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Enterprise Client</span>;
      case 'strategic_partner':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Strategic Partner</span>;
      case 'advisor':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">Advisor</span>;
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'active':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>;
      case 'evaluating':
        return <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Evaluating</span>;
      case 'negotiating':
        return <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Negotiating</span>;
      case 'portfolio':
        return <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Portfolio</span>;
      case 'inactive':
        return <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Inactive</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contacts & Investor Directory</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {filteredContacts.length} Contacts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Master contact directory for Sovereign Command, CBDO syndicate, and enterprise clients.
            </p>
          </div>

          <button
            id="smo-add-contact-btn"
            onClick={() => setIsContactModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Filter By:</span>
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-100 focus:outline-none"
          >
            <option value="all">All Contact Types</option>
            <option value="investor">Investors / VCs</option>
            <option value="grant_sponsor">Grant Sponsors / Jury</option>
            <option value="enterprise_client">Enterprise Clients</option>
            <option value="strategic_partner">Strategic Partners</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-100 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="evaluating">Evaluating</option>
            <option value="negotiating">Negotiating</option>
            <option value="portfolio">Portfolio</option>
          </select>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => {
            const assignee = teamMembers.find(m => m.id === contact.assignedTo);
            const relatedDeals = deals.filter(d => 
              d.contactEmail === contact.email || d.organization === contact.organization
            );

            return (
              <div
                key={contact.id}
                id={`smo-contact-card-${contact.id}`}
                onClick={() => setSelectedContact(contact)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    {getTypeBadge(contact.type)}
                    {getStatusBadge(contact.status)}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {contact.name}
                    </h3>
                    <div className="text-xs font-medium text-slate-600 truncate mt-0.5">
                      {contact.title}
                    </div>
                    <div className="text-xs text-indigo-700 font-semibold flex items-center gap-1 mt-1 truncate">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{contact.organization}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{contact.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Space and Assignee */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {contact.space}
                  </span>

                  {assignee && (
                    <div className="flex items-center gap-1.5" title={`Assigned to ${assignee.name}`}>
                      <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-slate-700 font-medium">
                        {assignee.name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Details Drawer */}
      {selectedContact && (
        <div 
          id="smo-contact-drawer-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end"
          onClick={() => setSelectedContact(null)}
        >
          <div 
            id="smo-contact-drawer"
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeBadge(selectedContact.type)}
                  {getStatusBadge(selectedContact.status)}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedContact.name}</h2>
                <div className="text-xs text-slate-500 font-medium">
                  {selectedContact.title} at <span className="text-slate-800 font-semibold">{selectedContact.organization}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="font-bold text-slate-900 text-xs mb-2">Direct Communications</div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <a href={`mailto:${selectedContact.email}`} className="hover:underline font-semibold">
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{selectedContact.phone}</span>
                  </div>
                )}
                {selectedContact.location && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{selectedContact.location}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedContact.notes && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>CRM Counterparty Notes</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {selectedContact.notes}
                  </p>
                </div>
              )}

              {/* Associated Deals */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800">Associated Pipeline Deals</div>
                {deals.filter(d => d.organization === selectedContact.organization || d.contactEmail === selectedContact.email).length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-400 text-center border border-dashed border-slate-200">
                    No active deals associated yet
                  </div>
                ) : (
                  deals
                    .filter(d => d.organization === selectedContact.organization || d.contactEmail === selectedContact.email)
                    .map(deal => (
                      <div key={deal.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{deal.title}</div>
                          <div className="text-[11px] text-slate-500">Stage: {deal.stage.toUpperCase()}</div>
                        </div>
                        <div className="font-bold text-slate-900 font-mono">
                          ${deal.value.toLocaleString()}
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Tags */}
              {selectedContact.tags.length > 0 && (
                <div>
                  <div className="font-bold text-slate-800 mb-1.5">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContact.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm(`Delete contact "${selectedContact.name}"?`)) {
                    deleteContact(selectedContact.id);
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Contact</span>
              </button>

              <button
                onClick={() => setSelectedContact(null)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
