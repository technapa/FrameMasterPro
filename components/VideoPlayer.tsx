import React, { useRef, useState, useEffect, useCallback } from 'react';
import { VideoState, CapturedFrame, ExportFormat, CaptureResolution } from '../types';
import { Button } from './Button';
import { Camera, Play, Pause, FastForward, Rewind, Settings2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface VideoPlayerProps {
  videoState: VideoState;
  onCapture: (frame: CapturedFrame) => void;
  onClear: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoState, onCapture, onClear }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [captureFormat, setCaptureFormat] = useState<ExportFormat>(ExportFormat.PNG);
  const [captureResolution, setCaptureResolution] = useState<CaptureResolution>(CaptureResolution.ORIGINAL);
  const [isSeeking, setIsSeeking] = useState(false);

  // Reset state when source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [videoState.src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    // Determine target dimensions based on resolution setting
    let targetWidth = video.videoWidth;
    let targetHeight = video.videoHeight;
    const aspectRatio = targetWidth / targetHeight;

    if (captureResolution === CaptureResolution.HD_1080P) {
        targetHeight = 1080;
        targetWidth = Math.round(targetHeight * aspectRatio);
    } else if (captureResolution === CaptureResolution.HD_720P) {
        targetHeight = 720;
        targetWidth = Math.round(targetHeight * aspectRatio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the video frame scaling it to the target dimensions
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    
    const dataUrl = canvas.toDataURL(captureFormat, captureFormat === ExportFormat.JPEG ? 0.95 : undefined);
    
    const frame: CapturedFrame = {
        id: uuidv4(),
        dataUrl,
        timestamp: video.currentTime,
        width: targetWidth,
        height: targetHeight,
        format: captureFormat
    };
    
    onCapture(frame);
  }, [captureFormat, captureResolution, onCapture]);

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 aspect-video group">
        <video
            ref={videoRef}
            src={videoState.src}
            className="w-full h-full object-contain cursor-pointer"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
        />
      </div>

      {/* Controls Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 shadow-lg">
        {/* Timeline Slider */}
        <div className="flex items-center gap-3 w-full">
                <span className="text-xs font-mono text-zinc-400 w-16 text-right">
                {new Date(currentTime * 1000).toISOString().substr(11, 8)}
                </span>
                <div className="relative flex-1 h-6 flex items-center">
                <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.01}
                    value={currentTime}
                    onChange={handleSeek}
                    onMouseDown={() => setIsSeeking(true)}
                    onMouseUp={() => setIsSeeking(false)}
                    className="absolute w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
                />
                </div>
                <span className="text-xs font-mono text-zinc-400 w-16">
                {new Date(duration * 1000).toISOString().substr(11, 8)}
                </span>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2 order-2 xl:order-1">
                <Button onClick={() => skip(-1)} variant="secondary" size="sm" icon={<Rewind className="w-4 h-4" />}>
                    -1s
                </Button>
                <Button onClick={togglePlay} variant={isPlaying ? "secondary" : "primary"} size="md" className="w-12 h-10 flex items-center justify-center">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </Button>
                <Button onClick={() => skip(1)} variant="secondary" size="sm" icon={<FastForward className="w-4 h-4" />}>
                    +1s
                </Button>
            </div>

            {/* Settings & Capture Controls */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-center xl:justify-end order-1 xl:order-2">
                
                {/* Resolution Selector */}
                <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
                    <Settings2 className="w-3.5 h-3.5 text-zinc-500 ml-1" />
                    <select 
                        value={captureResolution}
                        onChange={(e) => setCaptureResolution(e.target.value as CaptureResolution)}
                        className="bg-transparent text-xs font-medium text-zinc-300 outline-none border-none focus:ring-0 cursor-pointer pr-1"
                    >
                        <option value={CaptureResolution.ORIGINAL}>Original Size</option>
                        <option value={CaptureResolution.HD_1080P}>1080p (FHD)</option>
                        <option value={CaptureResolution.HD_720P}>720p (HD)</option>
                    </select>
                </div>

                {/* Format Toggle */}
                <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <button 
                        onClick={() => setCaptureFormat(ExportFormat.PNG)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${captureFormat === ExportFormat.PNG ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        PNG
                    </button>
                    <button 
                        onClick={() => setCaptureFormat(ExportFormat.JPEG)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${captureFormat === ExportFormat.JPEG ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        JPG
                    </button>
                </div>
                
                <Button 
                    onClick={captureFrame} 
                    variant="primary"
                    size="lg"
                    className="bg-gradient-to-r from-brand-600 to-orange-600 hover:from-brand-500 hover:to-orange-500 border-0 shadow-lg shadow-brand-900/20"
                    icon={<Camera className="w-5 h-5" />}
                >
                    Capture
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};