
import React, { useState, useEffect } from 'react';

interface HighlightedRelationship {
  type: string;
  targetElemen: string;
  description?: string;
}

interface Props {
  initialHighlight?: string | null;
  highlightedRelationships?: HighlightedRelationship[];
  onClose?: () => void;
  className?: string;
  embedded?: boolean;
  onElemenPilih?: (element: string | null) => void;
  compact?: boolean;
}

export const WuXingInteractiveDiagram: React.FC<Props> = ({ 
  initialHighlight, 
  highlightedRelationships = [], 
  className, 
  onElemenPilih,
  compact = false
}) => {
  const [selectedElemen, setPilihedElemen] = useState<string | null>(initialHighlight || null);

  useEffect(() => {
    if (initialHighlight) setPilihedElemen(initialHighlight.toLowerCase());
  }, [initialHighlight]);

  const nodes = {
    fire:  { x: 50, y: 15,  color: '#f43f5e', label: 'FIRE' },
    earth: { x: 85, y: 40,  color: '#f59e0b', label: 'EARTH' },
    metal: { x: 72, y: 80,  color: '#cbd5e1', label: 'METAL' },
    water: { x: 28, y: 80,  color: '#3b82f6', label: 'WATER' },
    wood:  { x: 15, y: 40,  color: '#10b981', label: 'WOOD' }
  };

  const isPathologyActive = highlightedRelationships.some(r => r.type === 'Overacting' || r.type === 'Insulting');

  const renderConnection = (startId: string, endId: string, baseTipe: 'Sheng' | 'Ke') => {
    const start = (nodes as any)[startId];
    const end = (nodes as any)[endId];
    
    // Cari hubungan patologis aktif
    const rel = highlightedRelationships.find(r => 
       r.targetElemen.toLowerCase() === endId && 
       (selectedElemen === startId || initialHighlight?.toLowerCase() === startId)
    );

    const insultingRel = highlightedRelationships.find(r => 
        r.type === 'Insulting' && 
        r.targetElemen.toLowerCase() === startId &&
        (selectedElemen === endId || initialHighlight?.toLowerCase() === endId)
    );

    const isOveracting = rel?.type === 'Overacting';
    const isInsulting = !!insultingRel;
    const isActivePathology = isOveracting || isInsulting;

    // Logika Opacity: Redupkan yang tidak terkait jika ada patologi
    let opacity = 0.15;
    if (isPathologyActive) {
      opacity = isActivePathology ? 1 : 0.05;
    } else {
      const isGenerating = selectedElemen === startId && baseTipe === 'Sheng';
      const isControlling = selectedElemen === startId && baseTipe === 'Ke';
      opacity = (isGenerating || isControlling) ? 0.8 : 0.15;
    }

    let strokeColor = baseTipe === 'Ke' ? '#f43f5e' : '#10b981';
    let strokeWidth = isActivePathology ? 4 : 1.5;
    let classNameStr = "";
    let dashArray = (baseTipe === 'Ke' && !isOveracting) ? "3,2" : "";

    if (isOveracting) {
        strokeColor = '#ef4444'; 
        strokeWidth = 6;
        classNameStr = "path-overacting animate-vibrate";
        dashArray = "";
    } else if (isInsulting) {
        strokeColor = '#f59e0b';
        strokeWidth = 5;
        classNameStr = "path-insulting animate-flow";
        dashArray = "1,2";
    }

    // Arah panah terbalik untuk Insulting (Wu)
    const x1_raw = isInsulting ? end.x : start.x;
    const y1_raw = isInsulting ? end.y : start.y;
    const x2_raw = isInsulting ? start.x : end.x;
    const y2_raw = isInsulting ? start.y : end.y;

    const dx = x2_raw - x1_raw;
    const dy = y2_raw - y1_raw;
    const angle = Math.atan2(dy, dx);
    const r = compact ? 8 : 10;
    
    const x1 = x1_raw + r * Math.cos(angle);
    const y1 = y1_raw + r * Math.sin(angle);
    const x2 = x2_raw - (r + 3) * Math.cos(angle);
    const y2 = y2_raw - (r + 3) * Math.sin(angle);

    return (
      <g key={`${startId}-${endId}-${baseTipe}`}>
        <path
          d={`M ${x1} ${y1} L ${x2} ${y2}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          fill="none"
          opacity={opacity}
          markerEnd={`url(#arrow-${startId}-${endId}-${baseTipe})`}
          className={classNameStr}
          style={{ transition: 'all 0.5s ease' }}
        />
        <defs>
          <marker id={`arrow-${startId}-${endId}-${baseTipe}`} markerWidth={4} markerHeight={4} refX={3} refY={2} orient="auto">
            <path d="M0,0 L0,4 L4,2 z" fill={strokeColor} opacity={opacity} />
          </marker>
        </defs>
      </g>
    );
  };

  return (
    <div className={`bg-purple-50 flex flex-col h-full overflow-hidden ${className || ''}`}>
      <div className="relative bg-white flex items-center justify-center p-6 flex-1">
        <svg viewBox="0 0 100 100" className="w-full h-full max-h-[85vh]">
          {/* Sheng Cycle */}
          {renderConnection('wood', 'fire', 'Sheng')}
          {renderConnection('fire', 'earth', 'Sheng')}
          {renderConnection('earth', 'metal', 'Sheng')}
          {renderConnection('metal', 'water', 'Sheng')}
          {renderConnection('water', 'wood', 'Sheng')}

          {/* Ke Cycle */}
          {renderConnection('wood', 'earth', 'Ke')}
          {renderConnection('earth', 'water', 'Ke')}
          {renderConnection('water', 'fire', 'Ke')}
          {renderConnection('fire', 'metal', 'Ke')}
          {renderConnection('metal', 'wood', 'Ke')}

          {Object.entries(nodes).map(([id, node]) => {
            const isTarget = highlightedRelationships.some(r => r.targetElemen.toLowerCase() === id);
            const isSource = selectedElemen === id || initialHighlight?.toLowerCase() === id;
            const isInvolved = isTarget || isSource;
            const nodeOpacity = isPathologyActive ? (isInvolved ? 1 : 0.2) : 1;

            return (
              <g 
                key={id} 
                className="cursor-pointer group" 
                onClick={() => { setPilihedElemen(id); onElemenPilih?.(id); }}
                style={{ opacity: nodeOpacity, transition: 'opacity 0.5s ease' }}
              >
                <circle 
                  cx={node.x} cy={node.y} r={compact ? 8 : 10} 
                  fill={selectedElemen === id ? node.color : "#fdf4ff"} 
                  stroke={node.color} 
                  strokeWidth={selectedElemen === id ? 3 : 1}
                  className="transition-all duration-300"
                />
                <text 
                  x={node.x} y={node.y + 1} 
                  textAnchor="middle" 
                  fontSize="3.5" 
                  fill={selectedElemen === id ? 'white' : node.color} 
                  fontWeight="900" 
                  className="pointer-events-none uppercase tracking-tighter"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-4 left-4 bg-white/90 border border-purple-200 p-3 rounded-xl text-[8px] font-black uppercase tracking-widest space-y-2 text-purple-900 shadow-sm">
           {isPathologyActive ? (
             <>
               <div className="text-purple-600 mb-1 border-b border-purple-100 pb-1">Pathology Focus</div>
               <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-red-600 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div> 
                  Menindas (Cheng)
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-dotted border-amber-400"></div> 
                  Menghina (Wu)
               </div>
             </>
           ) : (
             <>
               <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-emerald-500"></div> 
                  Generating (Sheng)
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-dashed border-rose-500"></div> 
                  Controlling (Ke)
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};
