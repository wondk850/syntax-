
import React, { useEffect, useState } from 'react';
import { LearningMaterial } from '../types';
import { MaterialService } from '../services/MaterialService';
import { MaterialCard } from './MaterialCard';
import { X, BookOpen, Filter, Loader2, Library } from 'lucide-react';

interface MaterialBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  modifierCode: number;
  modifierName: string;
}

export const MaterialBottomSheet: React.FC<MaterialBottomSheetProps> = ({ isOpen, onClose, modifierCode, modifierName }) => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<string | 'ALL'>('ALL');
  const [activeType, setActiveType] = useState<string | 'ALL'>('ALL');

  useEffect(() => {
    if (isOpen && modifierCode) {
      setLoading(true);
      MaterialService.getMaterialsByCode(modifierCode).then(data => {
        setMaterials(data);
        setLoading(false);
      });
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
    <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-auto transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="bg-slate-50 w-full max-w-2xl rounded-t-[2rem] shadow-2xl border-t border-amber-200 max-h-[85vh] flex flex-col pointer-events-auto animate-fade-in-up">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 bg-white rounded-t-[2rem] relative">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
               <Library size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {modifierName} <span className="text-amber-500 text-base font-bold">보물창고</span>
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                총 {materials.length}개의 학습 자료가 발견되었습니다.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col gap-3">
           {/* Source Filter */}
           <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1"><Filter size={12}/> 출처:</span>
              <button 
                onClick={() => setActiveSource('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeSource === 'ALL' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                전체
              </button>
              {sources.map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveSource(s)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeSource === s ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                  {s}
                </button>
              ))}
           </div>
           
           {/* Type Filter */}
           <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1"><Filter size={12}/> 유형:</span>
              <button 
                onClick={() => setActiveType('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeType === 'ALL' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                전체
              </button>
              {types.map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeType === t ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                  {t}
                </button>
              ))}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-40">
                <Loader2 size={32} className="text-amber-500 animate-spin mb-2" />
                <p className="text-slate-400 text-sm font-bold">보물상자를 여는 중...</p>
             </div>
          ) : filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
               {filteredMaterials.map((m, idx) => (
                 <MaterialCard key={idx} material={m} />
               ))}
            </div>
          ) : (
             <div className="text-center py-10 text-slate-400 font-bold">
               해당 조건의 자료가 없습니다.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
