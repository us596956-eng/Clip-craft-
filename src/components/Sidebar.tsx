import React from 'react';
import { Settings, Zap, Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { VideoFile, VideoAnalysis } from '../types';

interface SidebarProps {
  hookType: string;
  setHookType: (type: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysis: VideoAnalysis | null;
  onExport: () => void;
  isExporting: boolean;
  video: VideoFile | null;
  exportProgress: number;
}

export function Sidebar({ 
  hookType, 
  setHookType, 
  onAnalyze, 
  isAnalyzing, 
  analysis, 
  onExport, 
  isExporting,
  video,
  exportProgress
}: SidebarProps) {
  return (
    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0d0d0f] flex flex-col lg:h-full lg:overflow-y-auto shrink-0 pb-12 lg:pb-0">
      <div className="p-4 lg:p-6 border-b border-white/10">
        <h2 className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
          <Settings className="w-4 h-4" /> Clip Settings
        </h2>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 block">Hook Strategy</label>
          <div className="relative">
            <select
              value={hookType}
              onChange={(e) => setHookType(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg p-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#ccff00]"
            >
              <option value="Curiosity Gap">Curiosity Gap</option>
              <option value="Bold Statement">Bold Statement</option>
              <option value="Problem First">Problem First</option>
              <option value="Story Start">Story Start</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The AI will generate an engaging visual headline overlay for the first 3 seconds based on this framework.
          </p>
        </div>

        {video && !analysis && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 bg-[#ccff00] hover:bg-[#d9ff33] text-black px-6 py-4 rounded-lg font-black uppercase tracking-tighter text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Clip...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Find Viral Clip
              </>
            )}
          </button>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="p-6 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Virality Score</span>
                <span className="text-[#ccff00] text-xl font-black italic">{analysis.viralityScore}/100</span>
              </div>
              
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-[#ccff00]" style={{ width: `${analysis.viralityScore}%` }}></div>
              </div>

              <div className="text-sm leading-relaxed text-white font-medium italic mt-4 border-l-2 border-[#ccff00] pl-4">
                "{analysis.hookText}"
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed mt-2 uppercase font-black tracking-wider">
                {analysis.explanation}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 block">Caption Style</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#ccff00] text-black font-bold text-[10px] py-2 rounded uppercase text-center cursor-pointer">
                  Kinetic Highlight
                </div>
                <div className="bg-zinc-800 text-white font-bold text-[10px] py-2 rounded uppercase border border-white/5 text-center cursor-pointer">
                  Standard Box
                </div>
              </div>
            </div>

            <button
              onClick={onExport}
              disabled={isExporting}
              className="w-full bg-[#ccff00] hover:bg-[#d9ff33] text-black h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group mt-8 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    <span className="text-sm font-black uppercase tracking-tighter">Rendering... {Math.round(exportProgress)}%</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ease-out" style={{ width: `${exportProgress}%` }} />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black uppercase tracking-tighter">Generate Short MP4</span>
                    <Download className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </div>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
