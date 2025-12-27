
import React, { useEffect, useState } from 'react';
import { LearningMaterial } from '../types';
import { MaterialService } from '../services/MaterialService';
import { MaterialCard } from './MaterialCard';
import { X, BookOpen, Filter, Loader2, Library, AlertCircle, RefreshCw } from 'lucide-react';

interface MaterialBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  modifierCode: number;
  modifierName: string;
}

export const MaterialBottomSheet: React.FC<MaterialBottomSheetProps> = ({ isOpen, onClose, modifierCode, modifierName }) => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<string | 'ALL'>('ALL');
  const [activeType, setActiveType] = useState<string | 'ALL'>('ALL');

  const fetchMaterials = () => {
    if (modifierCode) {
      setLoading(true);
      setError(null);
      MaterialService.getMaterialsByCode(modifierCode)
        .then(data => {
          setMaterials(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("자료를 불러오지 못했습니다.");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen, modifierCode]);

  if (!isOpen) return null;

  const sources = MaterialService.getUniqueSources(materials);
  const types = MaterialService.getUniqueTypes(materials);

  const filteredMaterials = materials.filter(m => {
    if (activeSource !== 'ALL' && m.source !== activeSource) return false;
    if (activeType !== 'ALL' && m.type !== activeType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      {/* Backdrop - Ensure z-index is lower than the sheet */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Sheet - Added 'relative' and 'z-50' to strictly sit ON TOP of backdrop */}
      <div className="relative z-50 bg-white w-full max-w-2xl rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-amber-200 max-h-[85vh] flex flex-col pointer-events-auto animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 bg-white relative shrink-0">
          <div className="w-16 h-1.5 bg-slate-300 rounded-full mx-auto mb-5" />
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3.5 bg-amber-100 text-amber-600 rounded-2xl shadow-sm">
               <Library size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                {modifierName} <span className="text-amber-600 text-lg font-bold">보물창고</span>
              </h2>
              <p className="text-slate-600 font-bold mt-1">
                {loading ? "📦 창고 문 여는 중..." : `총 ${materials.length}개의 자료 발견`}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col gap-4 shrink-0 shadow-sm z-10">
           {/* Source Filter */}
           <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1">
              <span className="text-sm font-black text-slate-500 shrink-0 flex items-center gap-1"><Filter size={14}/> 출처</span>
              <button 
                onClick={() => setActiveSource('ALL')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap active:scale-95 ${activeSource === 'ALL' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300'}`}
              >
                전체
              </button>
              {sources.map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveSource(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap active:scale-95 ${activeSource === s ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300'}`}
                >
                  {s}
                </button>
              ))}
           </div>
           
           {/* Type Filter */}
           <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1">
              <span className="text-sm font-black text-slate-500 shrink-0 flex items-center gap-1"><Filter size={14}/> 유형</span>
              <button 
                onClick={() => setActiveType('ALL')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap active:scale-95 ${activeType === 'ALL' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
              >
                전체
              </button>
              {types.map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap active:scale-95 ${activeType === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                >
                  {t}
                </button>
              ))}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar min-h-[300px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 opacity-80">
                <Loader2 size={48} className="text-amber-500 animate-spin mb-4" />
                <p className="text-slate-800 text-lg font-bold animate-pulse">자료를 싣고 오는 중입니다...</p>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
               <div className="p-4 bg-red-100 rounded-full mb-3 text-red-500"><AlertCircle size={40} /></div>
               <p className="text-slate-800 font-bold text-lg mb-2">{error}</p>
               <button 
                 onClick={fetchMaterials}
                 className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 flex items-center gap-2"
               >
                 <RefreshCw size={16} /> 다시 시도
               </button>
            </div>
          ) : filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
               {filteredMaterials.map((m, idx) => (
                 <MaterialCard key={idx} material={m} />
               ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-center">
               <BookOpen size={48} className="text-slate-300 mb-4" />
               <p className="text-slate-600 text-lg font-bold mb-2">
                 이런! 해당 자료가 없습니다.
               </p>
               <p className="text-slate-400 text-sm">
                 필터를 변경하거나 나중에 다시 확인해주세요.
               </p>
               <button 
                 onClick={fetchMaterials}
                 className="mt-6 px-6 py-2 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm"
               >
                 <RefreshCw size={16} /> 새로고침
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
