
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, UploadCloud, ArrowRight } from 'lucide-react';

interface Step1ResumeProps {
  initialResumeText: string;
  onNext: (resumeText: string) => void;
}

export function Step1Resume({ initialResumeText, onNext }: Step1ResumeProps) {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [activeTab, setActiveTab] = useState("paste");
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain") {
        try {
          const text = await file.text();
          setResumeText(text);
          toast({
            title: "File Uploaded",
            description: `${file.name} has been successfully loaded.`,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error Reading File",
            description: "Could not read the content of the .txt file.",
          });
        }
      } else {
        setResumeText(""); // Clear previous text if invalid file
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a .txt file. For PDFs or other formats, please use the paste option.",
        });
      }
    }
  };

  const handleSubmit = () => {
    if (!resumeText.trim()) {
      toast({
        variant: "destructive",
        title: "Resume is Empty",
        description: "Please paste or upload your resume text.",
      });
      return;
    }
    onNext(resumeText);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Step 1: Your Resume
        </CardTitle>
        <CardDescription>
          Provide your existing resume. You can either paste the content or upload a .txt file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Resume</TabsTrigger>
            <TabsTrigger value="upload">Upload .txt File</TabsTrigger>
          </TabsList>
          <TabsContent value="paste" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="resume-paste-area">Paste your resume content here</Label>
              <Textarea
                id="resume-paste-area"
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={15}
                className="min-h-[300px] text-sm"
              />
            </div>
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="resume-upload-input">Upload your resume (.txt file)</Label>
              <div className="flex items-center gap-2 p-4 border border-dashed rounded-md">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                <Input
                  id="resume-upload-input"
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only .txt files are currently supported for direct upload. For PDF or Word documents, please copy and paste the text into the 'Paste Resume' tab.
              </p>
              {activeTab === 'upload' && resumeText && (
                 <p className="text-sm text-green-600 mt-2">Resume text loaded from file. You can switch to 'Paste Resume' tab to view/edit if needed or proceed.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <Button onClick={handleSubmit} className="w-full mt-6 text-base py-3">
          Next: Add Job Description
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
