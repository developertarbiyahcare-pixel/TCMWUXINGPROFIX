import React from 'react';
import { WuXingInteractiveDiagram } from './WuXingInteractiveDiagram';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialHighlight?: string | null;
}

const WuXingVisualizerModal: React.FC<Props> = ({ isOpen, onClose, initialHighlight }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-purple-200 w-full max-w-5xl rounded-2xl shadow-xl flex flex-col h-[90vh] md:h-[85vh] overflow-hidden">
        <WuXingInteractiveDiagram 
            initialHighlight={initialHighlight} 
            onClose={onClose} 
        />
      </div>
    </div>
  );
};

export default WuXingVisualizerModal;