
import React, { useState } from 'react';
import { LearningMaterial } from '../types';
import { FileText, Image, Code, File, ExternalLink, Copy, Check, MousePointerClick } from 'lucide-react';

interface MaterialCardProps {
  material: LearningMaterial;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const [copied, setCopied] = useState(false);

  // Determine Icon based on type
  const getIcon = () => {
    const typeLower = material.type.toLowerCase();
    if (typeLower.includes('image') || typeLower.includes('jpg') || typeLower.includes('png')) return <Image size={28} strokeWidth={2} />;
    if (typeLower.includes('html')) return <Code size={28} strokeWidth={2} />;
    if (typeLower.includes('pdf')) return <FileText size={28} strokeWidth={2} />;
    return <File size={28} strokeWidth={2} />;
  };

  const getIconColor = () => {
    const typeLower = material.type.toLowerCase();
    if (typeLower.includes('image')) return "bg-amber-100 text-amber-700 border-amber-200";
    if (typeLower.includes('html')) return "bg-orange-100 text-orange-700 border-orange-200";
    if (typeLower.includes('pdf')) return "bg-red-100 text-red-700 border-red-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use standard navigation. If it's an obsidian link, browser will handle protocol.
    window.location.href = material.link;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(material.link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className="bg-white border-2 border-slate-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center gap-4 group w-full cursor-pointer relative"
      onClick={handleOpen}
      role="button"
      title="클릭하여 열기"
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${getIconColor()} group-hover:scale-110 transition-transform`}>
        {getIcon()}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <h4 className="font-black text-slate-900 text-lg leading-snug truncate group-hover:text-indigo-700 transition-colors" title={material.filename}>
          {material.filename}
        </h4>
        
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {/* Source Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
            {material.source}
          </span>
          
          {/* Type Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
            {material.type}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 shrink-0 z-10">
        <button 
          onClick={handleOpen}
          className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 active:bg-indigo-800"
        >
          <ExternalLink size={16} strokeWidth={2.5} /> 열기
        </button>
        <button 
          onClick={handleCopy}
          className={`h-9 px-4 text-xs font-bold rounded-xl border-2 transition-all flex items-center justify-center gap-2 active:scale-95 ${copied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50'}`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "완료" : "복사"}
        </button>
      </div>
    </div>
  );
};
