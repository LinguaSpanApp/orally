"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, ClipboardList } from 'lucide-react';

interface DatasetItem {
  id: string;
  sentence: string;
}

interface DatasetImportProps {
  onImport: (items: DatasetItem[], datasetName: string) => void;
}

export function DatasetImport({ onImport }: DatasetImportProps) {
  const [pasteData, setPasteData] = useState('');
  const [datasetName, setDatasetName] = useState('my_dataset');
  
  const handlePasteImport = () => {
    const lines = pasteData.trim().split('\n');
    const items: DatasetItem[] = lines.map((line, index) => {
      const parts = line.split(/\t|\s{2,}/);
      if (parts.length >= 2) {
        return { id: parts[0].trim(), sentence: parts.slice(1).join(' ').trim() };
      }
      return { id: `line-${index + 1}`, sentence: line.trim() };
    });
    
    if (items.length > 0) {
      onImport(items, datasetName || 'dataset');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.trim().split(/\r?\n/);
      const items: DatasetItem[] = lines.map((line, index) => {
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        if (parts.length >= 2) {
          return { id: parts[0].trim(), sentence: parts.slice(1).join(' ').trim() };
        }
        return { id: `line-${index + 1}`, sentence: line.trim() };
      });
      onImport(items, datasetName || file.name.split('.')[0]);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Initialize Dataset</CardTitle>
        <CardDescription>Configure your recording session settings and data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dataset-name" className="text-sm font-medium">Dataset Name</Label>
          <Input 
            id="dataset-name"
            placeholder="e.g. medical_prompts_v1" 
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            className="font-medium"
          />
          <p className="text-xs text-muted-foreground">This will be the name of your exported ZIP file.</p>
        </div>

        <div className="h-px bg-border" />

        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Paste Data
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload File
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Paste IDs and sentences (ID [TAB] sentence)
              </Label>
              <Textarea 
                placeholder="001&#9;This is the first sentence to record.&#10;002&#9;And here is the second one." 
                className="min-h-[200px] font-mono text-sm"
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6" onClick={handlePasteImport} disabled={!pasteData.trim()}>
              Start Recording Session
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center flex flex-col items-center gap-4 transition-colors hover:border-primary/50">
              <div className="bg-primary/10 p-4 rounded-full">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Accepts .csv, .tsv, or .txt files</p>
              </div>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".csv,.tsv,.txt"
                onChange={handleFileUpload}
              />
              <Button asChild variant="outline" className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">Select File</label>
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground italic">
              Ensure the first column is the ID and the second is the sentence.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
