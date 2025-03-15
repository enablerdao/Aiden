import { Progress } from './ui/progress';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

type TaskProgressProps = {
  steps: string[];
  currentStep: number;
};

export function TaskProgress({ steps, currentStep }: TaskProgressProps) {
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;
  
  return (
    <div className="space-y-3 my-4">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      <ul className="space-y-1.5">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-0.5">
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : index === currentStep ? (
                <ArrowRight className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </span>
            <span className={`text-sm ${index === currentStep ? 'font-medium text-foreground' : index < currentStep ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
