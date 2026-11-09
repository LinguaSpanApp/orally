
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Volume2 } from 'lucide-react';
import { ttsPreviewTool } from '@/ai/flows/tts-preview-tool';

interface AIPreviewButtonProps {
  sentence: string;
}

export function AIPreviewButton({ sentence }: AIPreviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = async () => {
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
      return;
    }

    setIsLoading(true);
    try {
      const result = await ttsPreviewTool({ sentence });
      setPreviewUrl(result.audioDataUri);
      const audio = new Audio(result.audioDataUri);
      audio.play();
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2 border-accent/30 hover:bg-accent/5"
      onClick={handlePreview}
      disabled={isLoading || !sentence}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
      ) : previewUrl ? (
        <Volume2 className="w-4 h-4 text-accent" />
      ) : (
        <Sparkles className="w-4 h-4 text-accent" />
      )}
      {isLoading ? 'Generating Preview...' : previewUrl ? 'Play AI Preview' : 'AI Voice Preview'}
    </Button>
  );
}
