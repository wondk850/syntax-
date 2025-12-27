
import React, { useState } from 'react';
import { LearningMaterial } from '../types';
import { FileText, Image, Code, File, ExternalLink, Copy, Check } from 'lucide-react';

interface MaterialCardProps {
  material: LearningMaterial;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const [copied, setCopied] = useState(false);

  // Determine Icon based on type
  const getIcon = () => {
    const typeLower = material.type.toLowerCase();
    if (typeLower.includes('image') || typeLower.includes('jpg') || typeLower.includes('png')) return <Image size={20} className="text-amber-600" />;
    if (typeLower.includes('html')) return <Code size={20} className="text-orange-600" />;
    if (typeLower.includes('pdf')) return <FileText size={20} className="text-red-600" />;
    return <File size={20} className="text-slate-500" />;
  };

  const handleOpen = () => {
    // Attempt to open Obsidian URI
    window.location.href = material.link;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(material.link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 group">
      <div className="p-2 bg-amber-50 rounded-lg shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 text-sm truncate mb-1" title={material.filename}>
          {material.filename}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{material.source}</span>
          <span className="truncate opacity-70">{material.folder}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <button 
          onClick={handleOpen}
          className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg hover:bg-amber-200 transition-colors flex items-center justify-center gap-1"
        >
          <ExternalLink size={12} /> 열기
        </button>
        <button 
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 border border-slate-200"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? "완료" : "복사"}
        </button>
      </div>
    </div>
  );
};
