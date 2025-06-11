
"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { WizardProgress } from '@/components/wizard-progress';
import { Step1Resume } from '@/components/step-1-resume';
import { Step2JobDescription } from '@/components/step-2-job-description';
import { Step3Review } from '@/components/step-3-review';
import { tailorResume, TailorResumeInput } from '@/ai/flows/tailor-resume';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WIZARD_STEPS = ["Your Resume", "Job Description", "Review & Export"];

export default function ResumePilotPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Persist form data to localStorage
  useEffect(() => {
    const savedResumeText = localStorage.getItem('resumeText');
    const savedJobDescription = localStorage.getItem('jobDescription');
    if (savedResumeText) setResumeText(savedResumeText);
    if (savedJobDescription) setJobDescription(savedJobDescription);
  }, []);

  useEffect(() => {
    if (resumeText) localStorage.setItem('resumeText', resumeText);
  }, [resumeText]);

  useEffect(() => {
    if (jobDescription) localStorage.setItem('jobDescription', jobDescription);
  }, [jobDescription]);


  const handleResumeNext = (text: string) => {
    setResumeText(text);
    setCurrentStep(2);
  };

  const handleJobDescBack = () => {
    setCurrentStep(1);
  };

  const handleJobDescNext = async (jdText: string) => {
    setJobDescription(jdText);
    setIsLoading(true);

    if (!resumeText.trim()) {
        toast({
            variant: "destructive",
            title: "Missing Resume",
            description: "Resume text is missing. Please go back to Step 1.",
        });
        setIsLoading(false);
        setCurrentStep(1); // Force user back to step 1
        return;
    }

    try {
      const input: TailorResumeInput = {
        resumeText: resumeText,
        jobDescription: jdText,
      };
      const result = await tailorResume(input);
      setTailoredResume(result.tailoredResume);
      setCurrentStep(3);
    } catch (error) {
      console.error("Error tailoring resume:", error);
      toast({
        variant: "destructive",
        title: "AI Tailoring Failed",
        description: "An error occurred while tailoring your resume. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setResumeText("");
    setJobDescription("");
    setTailoredResume("");
    localStorage.removeItem('resumeText');
    localStorage.removeItem('jobDescription');
    setCurrentStep(1);
    toast({
      title: "Form Reset",
      description: "You can start fresh now!",
    });
  };

  const renderStepContent = () => {
    if (isLoading && currentStep === 2) { // Show loading specifically when transitioning from step 2
      return (
        <Card className="w-full max-w-md mx-auto shadow-xl text-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Tailoring Your Resume</CardTitle>
            <CardDescription>Our AI is working its magic... Please wait.</CardDescription>
          </CardHeader>
          <CardContent className="py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          </CardContent>
        </Card>
      );
    }

    switch (currentStep) {
      case 1:
        return <Step1Resume initialResumeText={resumeText} onNext={handleResumeNext} />;
      case 2:
        return (
          <Step2JobDescription
            initialJobDescription={jobDescription}
            onBack={handleJobDescBack}
            onNext={handleJobDescNext}
            isLoading={isLoading}
          />
        );
      case 3:
        return <Step3Review initialTailoredResume={tailoredResume} onStartOver={handleStartOver} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <WizardProgress currentStep={currentStep} totalSteps={WIZARD_STEPS.length} stepNames={WIZARD_STEPS} />
        <div className="mt-8">
          {renderStepContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} ResumePilot. All rights reserved.
      </footer>
    </div>
  );
}
