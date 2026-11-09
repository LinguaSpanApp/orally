"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DatasetImport } from './DatasetImport';
import { useRecorder } from '@/hooks/useRecorder';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  Download, 
  CheckCircle2,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatasetItem {
  id: string;
  sentence: string;
  recordedBlob?: Blob;
  recordedUrl?: string;
}

export function RecordingDashboard() {
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [datasetName, setDatasetName] = useState('oraly_dataset');
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  
  const recorder = useRecorder();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentItem = items[currentIndex];
  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;
  const completedCount = items.filter(item => item.recordedBlob).length;

  const handleImport = (newItems: DatasetItem[], name: string) => {
    setItems(newItems);
    setDatasetName(name);
    setIsSessionStarted(true);
    setCurrentIndex(0);
  };

  const handleRecordToggle = () => {
    if (recorder.status === 'recording') {
      recorder.stopRecording();
    } else {
      recorder.startRecording();
    }
  };

  useEffect(() => {
    if (recorder.status === 'recorded' && recorder.audioBlob && recorder.audioUrl) {
      setItems(prev => {
        const next = [...prev];
        next[currentIndex] = {
          ...next[currentIndex],
          recordedBlob: recorder.audioBlob!,
          recordedUrl: recorder.audioUrl!,
        };
        return next;
      });
    }
  }, [recorder.status, recorder.audioBlob, recorder.audioUrl, currentIndex]);

  const navigate = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < items.length) {
      setCurrentIndex(newIndex);
      recorder.resetRecording();
    }
  };

  const playBack = () => {
    const url = currentItem.recordedUrl || recorder.audioUrl;
    if (url && audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const handleExport = async () => {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    
    items.forEach(item => {
      if (item.recordedBlob) {
        zip.file(`${item.id}.webm`, item.recordedBlob);
      }
    });

    const metadata = items.map(i => `${i.id}\t${i.sentence}`).join('\n');
    zip.file('metadata.tsv', metadata);

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName}.zip`;
    a.click();
  };

  if (!isSessionStarted) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <DatasetImport onImport={handleImport} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            {datasetName} <span className="text-sm font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded">Recording Studio</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Item {currentIndex + 1} of {items.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</p>
            <p className="text-sm font-bold">{completedCount} / {items.length} Recorded</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsSessionStarted(false)}>
            <Settings2 className="w-4 h-4 mr-2" /> Session Settings
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground" 
            size="sm"
            onClick={handleExport}
            disabled={completedCount === 0}
          >
            <Download className="w-4 h-4 mr-2" /> Export ZIP
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
        <Card className="w-full bg-white shadow-xl border-none overflow-hidden">
          <CardContent className="p-8 md:p-16 flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                ID: {currentItem.id}
              </span>
              <h2 className="text-3xl md:text-4xl font-headline font-medium leading-tight text-foreground">
                {currentItem.sentence}
              </h2>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full items-center gap-8">
          <div className="flex justify-center md:justify-end">
            <Button 
              variant="ghost" 
              size="lg" 
              className="rounded-full h-14 w-14 p-0"
              onClick={() => navigate('prev')}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Button
                onClick={handleRecordToggle}
                className={cn(
                  "h-24 w-24 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95",
                  recorder.status === 'recording' 
                    ? "bg-red-500 hover:bg-red-600 record-pulse" 
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {recorder.status === 'recording' ? (
                  <Square className="w-10 h-10 text-white" fill="white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </Button>
              {currentItem.recordedBlob && recorder.status !== 'recording' && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <p className={cn(
              "text-sm font-medium tracking-wide transition-colors",
              recorder.status === 'recording' ? "text-red-500 animate-pulse" : "text-muted-foreground"
            )}>
              {recorder.status === 'recording' ? 'RECORDING NOW...' : 'TAP MIC TO RECORD'}
            </p>
          </div>

          <div className="flex justify-center md:justify-start">
            <Button 
              variant="ghost" 
              size="lg" 
              className="rounded-full h-14 w-14 p-0"
              onClick={() => navigate('next')}
              disabled={currentIndex === items.length - 1}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {(currentItem.recordedUrl || recorder.audioUrl) && recorder.status !== 'recording' && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <Button variant="outline" onClick={playBack} className="rounded-full px-6">
              <Play className="w-4 h-4 mr-2" fill="currentColor" /> Play Recording
            </Button>
            <Button variant="ghost" onClick={recorder.resetRecording} className="text-muted-foreground hover:text-primary">
              <RotateCcw className="w-4 h-4 mr-2" /> Rerecord
            </Button>
          </div>
        )}
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className="hidden md:flex justify-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
        <span className="flex items-center gap-1.5"><kbd className="bg-muted px-1.5 py-0.5 rounded border shadow-sm">Space</kbd> Record/Stop</span>
        <span className="flex items-center gap-1.5"><kbd className="bg-muted px-1.5 py-0.5 rounded border shadow-sm">←</kbd> Previous</span>
        <span className="flex items-center gap-1.5"><kbd className="bg-muted px-1.5 py-0.5 rounded border shadow-sm">→</kbd> Next</span>
      </div>
    </div>
  );
}
