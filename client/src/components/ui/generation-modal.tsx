import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle, XCircle } from "lucide-react";
import type { ToolGenerationProgress } from "@/lib/types";

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  progress: ToolGenerationProgress;
}

export function GenerationModal({ isOpen, onClose, toolName, progress }: GenerationModalProps) {
  const steps = [
    { key: 'analyzing', label: 'Understanding requirements...' },
    { key: 'planning', label: 'Generating code architecture...' },
    { key: 'validating', label: 'Checking legal compliance...' },
    { key: 'generating', label: 'Building with AI and API integrations...' },
    { key: 'testing', label: 'Testing API integrations and optimization...' },
    { key: 'deploying', label: 'Finalizing deployment...' },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === progress.step);
  };

  const isStepCompleted = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex > stepIndex || progress.step === 'completed';
  };

  const isStepCurrent = (stepIndex: number) => {
    return getCurrentStepIndex() === stepIndex;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/20 max-w-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            {progress.step === 'completed' ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : progress.step === 'error' ? (
              <XCircle className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
            <span className="gradient-text">
              {progress.step === 'completed' ? 'Tool Generated Successfully!' : 
               progress.step === 'error' ? 'Generation Failed' : 
               'AI Building Your Tool'}
            </span>
          </h2>
          
          <p className="text-gray-300 mb-8">
            {progress.step === 'completed' 
              ? `"${toolName}" is ready to use! 🎉`
              : progress.step === 'error'
              ? progress.message
              : `Building "${toolName}" for you...`
            }
          </p>
          
          {progress.step !== 'error' && (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <Progress 
                  value={progress.progress} 
                  className="w-full h-3 bg-white/10"
                />
                <div className="text-sm text-gray-400 mt-2">
                  {progress.progress}% Complete
                </div>
              </div>

              {/* Generation Steps */}
              <div className="space-y-3 text-left mb-8">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                      isStepCompleted(index) 
                        ? 'bg-secondary' 
                        : isStepCurrent(index)
                        ? 'border-2 border-secondary bg-secondary/20'
                        : 'border-2 border-gray-600'
                    }`} />
                    <span className={`text-sm ${
                      isStepCompleted(index) || isStepCurrent(index)
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <Button 
            onClick={onClose} 
            variant={progress.step === 'completed' ? 'default' : 'ghost'}
            className={progress.step === 'completed' 
              ? 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg' 
              : 'bg-white/10 hover:bg-white/20'
            }
          >
            {progress.step === 'completed' ? 'View Tool' : 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
