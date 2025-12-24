import React, { useState } from 'react';
import { VideoState, CapturedFrame } from './types';
import { VideoUploader } from './components/VideoUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { FrameGallery } from './components/FrameGallery';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [videoState, setVideoState] = useState<VideoState | null>(null);
  const [frames, setFrames] = useState<CapturedFrame[]>([]);

  const handleCapture = (frame: CapturedFrame) => {
    setFrames(prev => [frame, ...prev]);
  };

  const handleClearVideo = () => {
    // Revoke object URL to avoid memory leaks
    if (videoState?.src) {
      URL.revokeObjectURL(videoState.src);
    }
    setVideoState(null);
    setFrames([]);
  };

  const handleDeleteFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateFrame = (id: string, updates: Partial<CapturedFrame>) => {
    setFrames(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-brand-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Image */}
            <img 
              src="./icon.ico" 
              alt="Logo" 
              className="w-10 h-10 object-contain drop-shadow-lg hover:scale-105 transition-transform" 
            />
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">FrameMaster<span className="text-brand-500">Pro</span></h1>
              <span className="text-sm font-light text-zinc-500">by Technapa</span>
            </div>
          </div>
          
          {videoState && (
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearVideo}
                icon={<ArrowLeft className="w-4 h-4" />}
            >
                Back to Upload
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!videoState ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <VideoUploader onLoad={setVideoState} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Video Player */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold truncate max-w-md" title={videoState.name}>
                        {videoState.name || "Unknown Video"}
                    </h2>
                </div>
                
                <VideoPlayer 
                    videoState={videoState} 
                    onCapture={handleCapture} 
                    onClear={handleClearVideo} 
                />
            </div>

            {/* Right Column: Gallery */}
            <div className="lg:col-span-4 flex flex-col h-[calc(100vh-8rem)]">
              <div className="flex-1 overflow-y-auto pr-2 pb-20">
                 <FrameGallery 
                    frames={frames} 
                    onDelete={handleDeleteFrame} 
                    onUpdateFrame={handleUpdateFrame}
                 />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;