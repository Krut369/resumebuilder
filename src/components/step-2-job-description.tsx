
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Wand2, ArrowLeft, Loader2 } from 'lucide-react';

interface Step2JobDescriptionProps {
  initialJobDescription: string;
  onBack: () => void;
  onNext: (jobDescription: string) => void;
  isLoading: boolean;
}

export function Step2JobDescription({ initialJobDescription, onBack, onNext, isLoading }: Step2JobDescriptionProps) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Job Description is Empty",
        description: "Please paste the job description.",
      });
      return;
    }
    onNext(jobDescription);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          Step 2: Job Description
        </CardTitle>
        <CardDescription>
          Paste the job description you're applying for. Our AI will use this to tailor your resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="job-description-area">Job Description</Label>
          <Textarea
            id="job-description-area"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={15}
            className="min-h-[300px] text-sm"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button onClick={onBack} variant="outline" className="w-full sm:w-auto text-base py-3" disabled={isLoading}>
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:flex-1 text-base py-3" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 w-5 h-5" />
            )}
            {isLoading ? 'Tailoring Your Resume...' : 'Tailor Resume with AI'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
