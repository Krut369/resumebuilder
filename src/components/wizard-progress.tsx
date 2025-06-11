
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export function WizardProgress({ currentStep, totalSteps, stepNames }: WizardProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300',
                currentStep >= step ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-foreground'
              )}
            >
              {currentStep > step ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <span>{step}</span>
              )}
            </div>
            <p className={cn(
                "mt-2 text-xs text-center md:text-sm",
                currentStep >= step ? "text-primary font-medium" : "text-muted-foreground"
            )}>
                {stepNames[step-1]}
            </p>
            {step < totalSteps && (
              <div className={cn(
                "flex-1 h-1 transition-colors duration-300 -mt-7 -ml-[50%] -mr-[50%] relative top-4 -z-10",
                currentStep > step ? "bg-primary" : "bg-border"
              )}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
