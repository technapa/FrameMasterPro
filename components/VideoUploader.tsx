import React, { useState } from 'react';
import { Upload, FileVideo, MonitorPlay } from 'lucide-react';
import { VideoState } from '../types';

interface VideoUploaderProps {
  onLoad: (state: VideoState) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onLoad }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      const src = URL.createObjectURL(file);
      onLoad({
        src,
        file,
        name: file.name
      });
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 flex flex-col justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-orange-400">
          FrameMaster Pro
        </h2>
        <p className="text-zinc-400 text-lg">
          Import videos to extract high-resolution 1080p/4K stills.
        </p>
      </div>

      <div 
        className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all cursor-pointer shadow-2xl
          ${dragActive ? 'border-brand-500 bg-brand-500/10 scale-[1.02]' : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-500 hover:shadow-brand-500/10'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          id="file-upload"
          type="file" 
          className="hidden" 
          accept="video/*"
          onChange={handleChange}
        />
        <div className="bg-gradient-to-br from-brand-500 to-orange-600 p-6 rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-10 h-10 text-white" />
        </div>
        <p className="text-zinc-200 font-bold text-xl mb-2">Click to Upload Video</p>
        <p className="text-zinc-500 text-base">or drag and drop video file here</p>
        
        <div className="flex gap-3 mt-8">
          <span className="px-3 py-1 rounded-full bg-zinc-950/50 border border-zinc-800 text-xs text-zinc-500 font-mono">.MP4</span>
          <span className="px-3 py-1 rounded-full bg-zinc-950/50 border border-zinc-800 text-xs text-zinc-500 font-mono">.MOV</span>
          <span className="px-3 py-1 rounded-full bg-zinc-950/50 border border-zinc-800 text-xs text-zinc-500 font-mono">.MKV</span>
        </div>
      </div>

      <div className="flex justify-center gap-12 text-zinc-500 text-sm font-medium">
        <div className="flex items-center gap-2">
            <FileVideo className="w-5 h-5 text-brand-500" />
            <span>Local Processing</span>
        </div>
        <div className="flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-brand-500" />
            <span>Original Quality</span>
        </div>
      </div>
    </div>
  );
};