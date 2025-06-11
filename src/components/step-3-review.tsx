
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download, Edit3, RotateCcw, FileText, FileCode } from 'lucide-react';

interface Step3ReviewProps {
  initialTailoredResume: string;
  onStartOver: () => void;
}

export function Step3Review({ initialTailoredResume, onStartOver }: Step3ReviewProps) {
  const [tailoredResume, setTailoredResume] = useState(initialTailoredResume);
  const { toast } = useToast();

  useEffect(() => {
    setTailoredResume(initialTailoredResume);
  }, [initialTailoredResume]);

  const handleDownload = (format: 'txt' | 'md') => {
    if (!tailoredResume.trim()) {
      toast({
        variant: "destructive",
        title: "Resume is Empty",
        description: "There is no resume content to download.",
      });
      return;
    }

    const blob = new Blob([tailoredResume], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResumePilot_Tailored_Resume.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Your tailored resume has been downloaded as a .${format} file.`,
    });
  };
  
  const handleCopyToClipboard = () => {
    if (!tailoredResume.trim()) {
      toast({
        variant: "destructive",
        title: "Resume is Empty",
        description: "Nothing to copy.",
      });
      return;
    }
    navigator.clipboard.writeText(tailoredResume).then(() => {
      toast({ title: "Copied to Clipboard", description: "Tailored resume copied to clipboard." });
    }).catch(err => {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy text to clipboard." });
    });
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-primary" />
          Step 3: Review & Export Your AI-Tailored Resume
        </CardTitle>
        <CardDescription>
          Your resume has been tailored by AI. Review the content below, make any final adjustments, and then export it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="tailored-resume-area">Tailored Resume</Label>
          <Textarea
            id="tailored-resume-area"
            value={tailoredResume}
            onChange={(e) => setTailoredResume(e.target.value)}
            rows={20}
            className="min-h-[400px] text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
           <Button onClick={handleCopyToClipboard} variant="outline" className="w-full text-base py-3">
            <FileText className="mr-2 w-5 h-5" />
            Copy Text
          </Button>
          <Button onClick={() => handleDownload('txt')} variant="outline" className="w-full text-base py-3">
            <Download className="mr-2 w-5 h-5" />
            Download .txt
          </Button>
          <Button onClick={() => handleDownload('md')} variant="outline" className="w-full text-base py-3">
            <FileCode className="mr-2 w-5 h-5" />
            Download .md
          </Button>
        </div>
         <p className="text-xs text-muted-foreground mt-2 text-center">PDF export coming soon!</p>
        <Button onClick={onStartOver} className="w-full mt-4 text-base py-3" variant="default">
          <RotateCcw className="mr-2 w-5 h-5" />
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}
