import React from 'react';
import { CapturedFrame } from '../types';
import { Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface FrameGalleryProps {
  frames: CapturedFrame[];
  onDelete: (id: string) => void;
  onUpdateFrame: (id: string, updates: Partial<CapturedFrame>) => void;
}

export const FrameGallery: React.FC<FrameGalleryProps> = ({ frames, onDelete }) => {
  const handleDownload = (frame: CapturedFrame) => {
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    const ext = frame.format === 'image/jpeg' ? 'jpg' : 'png';
    link.download = `frame_${frame.timestamp.toFixed(2)}s.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (frames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
        <ImageIcon className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm font-medium">No frames captured yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-500" />
          Captured Frames <span className="text-zinc-500 text-sm font-normal">({frames.length})</span>
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {frames.map((frame) => (
          <div key={frame.id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex gap-4 hover:border-zinc-700 transition-colors shadow-sm">
            
            {/* Left: Thumbnail */}
            <div className="relative w-40 aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800 group cursor-pointer" onClick={() => handleDownload(frame)}>
              <img src={frame.dataUrl} alt="Frame" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                 <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transition-opacity" />
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1 flex flex-col min-w-0">
               {/* Header Info */}
               <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                     {frame.width}x{frame.height} • {frame.format.split('/')[1].toUpperCase()} <br/>
                     <span className="text-zinc-400 font-bold">@{frame.timestamp.toFixed(2)}s</span>
                  </div>
                  <button 
                    onClick={() => onDelete(frame.id)} 
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1 -mr-1"
                    title="Delete frame"
                  >
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>

               {/* Action Buttons */}
               <div className="mt-auto pt-2 border-t border-zinc-800/50 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full h-8 text-xs bg-zinc-800 hover:bg-brand-600 hover:text-white border-transparent" 
                    onClick={() => handleDownload(frame)}
                    icon={<Download className="w-3 h-3" />}
                  >
                     Save
                  </Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};