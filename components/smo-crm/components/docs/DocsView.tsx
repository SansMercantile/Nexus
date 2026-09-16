import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Layers, 
  Sparkles,
  Download
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { DocumentItem } from '../../types';

export const DocsView: React.FC = () => {
  const { documents } = useCrm();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(documents[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedDoc.contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedDoc.contentMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedDoc.title.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Docs & Rubrics</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Sovereign Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Master investor repositories, CBDO lead scoring criteria, and commercial rail specs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Docs Directory */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-white p-3 overflow-y-auto space-y-1.5">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-2 py-1">
            Documents ({documents.length})
          </div>

          {documents.map(doc => {
            const isSelected = selectedDoc.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {doc.space}
                  </span>
                  <span>{doc.updatedAt}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 mt-1.5 leading-snug">
                  {doc.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Rendered Document */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50/50 overflow-y-auto p-6">
          <div className="max-w-3xl w-full mx-auto bg-white rounded-xl border border-slate-200 p-8 shadow-2xs space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  {selectedDoc.space}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedDoc.title}</h2>
                <div className="text-xs text-slate-400 mt-1">
                  Last revised: {selectedDoc.updatedAt} · Sans Mercantile Operations
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Copy document markdown"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Rendered content */}
            <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-4 font-sans text-slate-800">
              {selectedDoc.contentMarkdown.split('\n\n').map((block, idx) => {
                if (block.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-lg font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">
                      {block.replace('# ', '')}
                    </h1>
                  );
                }
                if (block.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-sm font-bold text-slate-900 pt-3 text-indigo-950">
                      {block.replace('## ', '')}
                    </h2>
                  );
                }
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-xs font-bold text-slate-800 pt-1">
                      {block.replace('### ', '')}
                    </h3>
                  );
                }
                if (block.includes('|') && block.includes('\n|')) {
                  // Table rendering
                  const rows = block.trim().split('\n');
                  const headerRow = rows[0].split('|').filter(c => c.trim().length > 0);
                  const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim().length > 0));

                  return (
                    <div key={idx} className="overflow-x-auto my-3 border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            {headerRow.map((cell, ci) => (
                              <th key={ci} className="py-2 px-3">{cell.trim()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {dataRows.map((row, ri) => (
                            <tr key={ri} className="hover:bg-slate-50">
                              {row.map((cell, ci) => (
                                <td key={ci} className="py-2 px-3 text-slate-700">{cell.trim()}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                if (block.startsWith('- ')) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1">
                      {block.split('\n').map((li, lidx) => (
                        <li key={lidx}>{li.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-slate-700 leading-normal">
                    {block}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
