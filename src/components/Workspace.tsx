import React, { useRef, useEffect, useState } from 'react';
import { VideoFile, VideoAnalysis, Word } from '../types';

interface WorkspaceProps {
  video: VideoFile;
  analysis: VideoAnalysis | null;
}

export function Workspace({ video, analysis }: WorkspaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleTimeUpdate = () => {
      setCurrentTime(v.currentTime * 1000); // ms
    };

    v.addEventListener('timeupdate', handleTimeUpdate);
    return () => v.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const handleWordClick = (word: Word) => {
    if (videoRef.current) {
      videoRef.current.currentTime = word.startMs / 1000;
      videoRef.current.play();
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Video Preview Panel */}
      <div className="w-full lg:flex-1 border-b lg:border-r border-white/10 bg-black flex flex-col relative items-center justify-center p-4 lg:p-8 shrink-0 min-h-[50vh] lg:min-h-0">
        <div className="relative aspect-[9/16] h-full max-h-[50vh] lg:max-h-[800px] bg-[#161618] rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden border border-white/10 ring-1 ring-white/5 flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.objectUrl}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            playsInline
          />
          
          {/* Overlay Hook */}
          {analysis && currentTime < 3000 && (
            <div className="absolute top-16 inset-x-0 px-8 text-center pointer-events-none fade-in">
              <h1 className="bg-black text-[#ccff00] text-3xl font-black italic uppercase p-2 inline-block transform -skew-x-12 tracking-tighter">
                {analysis.hookText}
              </h1>
            </div>
          )}

          {/* Captions Overlay */}
          {analysis && (
            <div className="absolute bottom-32 inset-x-4 text-center pointer-events-none">
              <div className="inline-block bg-transparent px-6 py-3 rounded-2xl transform transition-all">
                <p className="text-white font-black text-2xl uppercase tracking-tight leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  {analysis.words.map((w, i) => {
                    // Highlight word if current time is within its start/end ms
                    const isActive = currentTime >= w.startMs && currentTime <= w.endMs;
                    // Proximity fading
                    const isPast = currentTime > w.endMs;
                    const isFuture = currentTime < w.startMs;
                    
                    // Only show nearby words in caption box for clean look
                    if (w.startMs > currentTime + 2000 || w.endMs < currentTime - 2000) return null;

                    return (
                      <span 
                        key={i} 
                        className={`mx-1 transition-colors duration-150 ${isActive ? 'text-[#ccff00] bg-zinc-800 px-1 font-bold' : isPast ? 'text-zinc-500' : 'text-white'}`}
                      >
                        {w.word}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcription / Timeline Panel */}
      <div className="w-full lg:w-[400px] bg-[#0d0d0f] flex flex-col shrink-0 h-[40vh] lg:h-full lg:border-l border-white/10">
        <div className="p-4 lg:p-6 border-b border-white/10">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Transcription / High Impact</label>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {analysis ? (
             <div className="prose prose-invert prose-p:leading-loose">
               <p className="text-sm leading-relaxed text-zinc-400 font-medium">
                {analysis.words.map((w, i) => {
                  const isActive = currentTime >= w.startMs && currentTime <= (w.endMs + 200); // slight bleed for smoothness
                  return (
                    <span
                      key={i}
                      onClick={() => handleWordClick(w)}
                      className={`inline-block mx-0.5 cursor-pointer transition-all duration-200 rounded ${
                        isActive 
                          ? 'text-[#ccff00] bg-zinc-800 px-1 font-bold scale-110' 
                          : 'hover:bg-zinc-800 hover:text-white px-1'
                      }`}
                    >
                      {w.word}
                    </span>
                  );
                })}
               </p>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
              <div className="w-16 h-16 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-sm text-center max-w-[200px]">Transcript will appear here once the clip is analyzed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
