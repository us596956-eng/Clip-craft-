import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo } from 'lucide-react';
import { VideoFile } from '../types';

interface UploadZoneProps {
  onFileSelect: (file: VideoFile) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('video/')) {
      const objUrl = URL.createObjectURL(file);
      onFileSelect({
        file,
        objectUrl: objUrl,
        name: file.name,
        size: file.size,
      });
    } else {
      alert("Please select a valid video file.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 w-full max-w-full overflow-hidden">
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full max-w-2xl aspect-[4/5] lg:aspect-video border border-dashed rounded-3xl lg:rounded-[2rem] flex flex-col items-center justify-center p-6 lg:p-12 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 hover:border-white/20 bg-zinc-900/50'}`}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#0d0d0f] border border-white/5 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-inner shrink-0">
          <UploadCloud className="w-8 h-8 lg:w-10 lg:h-10 text-zinc-400 group-hover:text-[#ccff00]" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-black uppercase text-white mb-2 lg:mb-3 tracking-tighter">Drop your video here</h2>
        <p className="text-zinc-500 max-w-sm mb-6 lg:mb-8 text-xs lg:text-sm font-medium px-4">
          Upload any MP4, MOV, or WEBM file. ClipCraft AI will automatically analyze and extract the most engaging segments.
        </p>
        
        <label 
          htmlFor="file-upload" 
          className="inline-flex items-center gap-2 px-6 py-4 bg-[#ccff00] text-black text-sm font-black uppercase tracking-wider rounded-lg hover:bg-[#d9ff33] transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <FileVideo className="w-5 h-5" strokeWidth={2.5} />
          Select File
          <input
            id="file-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
}
