import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { Workspace } from './components/Workspace';
import { Sidebar } from './components/Sidebar';
import { VideoFile, VideoAnalysis } from './types';
import { Scissors } from 'lucide-react';

export default function App() {
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [hookType, setHookType] = useState('Curiosity Gap');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!video) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: video.name,
          fileSize: video.size,
          hookType: hookType,
          duration: '30s'
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data);
      } else {
        alert("Error analyzing video: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to analyze clip.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!video || !analysis) return;
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate complex FFmpeg WASM processing & rendering.
    const duration = 4000; // 4 seconds fake render
    const interval = 100;
    const steps = duration / interval;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const baseProgress = (step / steps) * 100;
      // Add slight jitter for realism
      const jitter = Math.random() * 2 - 1; 
      const progress = Math.min(100, baseProgress + jitter);
      
      setExportProgress(progress);
      
      if (step >= steps) {
        clearInterval(timer);
        setIsExporting(false);
        setExportProgress(100);
        
        // Let the user "download" a copy of the video (simulated)
        const a = document.createElement('a');
        a.href = video.objectUrl;
        a.download = `clipcraft-${Date.now()}.mp4`;
        a.click();
      }
    }, interval);
  };

  return (
    <div className="h-[100dvh] bg-[#0a0a0b] text-zinc-300 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 lg:h-16 bg-[#0d0d0f] border-b border-white/10 flex items-center px-4 lg:px-8 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-sm bg-[#ccff00] flex items-center justify-center">
            <Scissors className="w-4 h-4 lg:w-5 lg:h-5 text-black" />
          </div>
          <h1 className="text-lg lg:text-xl font-black tracking-tighter text-white uppercase">ClipCraft<span className="text-[#ccff00]"> AI</span></h1>
        </div>
        
        {video && (
          <button 
            onClick={() => {
              setVideo(null);
              setAnalysis(null);
            }} 
            className="text-[9px] lg:text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-[#ccff00] transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Start New Project</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
        {video ? (
          <>
            <div className="flex-1 flex flex-col min-h-0 shrink-0">
              <Workspace video={video} analysis={analysis} />
            </div>
            <Sidebar 
              hookType={hookType}
              setHookType={setHookType}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              analysis={analysis}
              onExport={handleExport}
              isExporting={isExporting}
              video={video}
              exportProgress={exportProgress}
            />
          </>
        ) : (
          <UploadZone onFileSelect={setVideo} />
        )}
      </div>
    </div>
  );
}
