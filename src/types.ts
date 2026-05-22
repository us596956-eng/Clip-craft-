export interface Word {
  word: string;
  startMs: number;
  endMs: number;
}

export interface VideoAnalysis {
  hookText: string;
  viralityScore: number;
  explanation: string;
  words: Word[];
}

export interface VideoFile {
  file: File;
  objectUrl: string;
  name: string;
  size: number;
}
