import { CodeBlock } from './ui/code-block';
import { TaskProgress } from './TaskProgress';
import { Avatar } from './ui/avatar';
import { User, Bot } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskSteps?: string[];
  currentStep?: number;
  codeBlocks?: { language: string; code: string }[];
};

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`flex gap-3 ${message.role === 'assistant' ? 'items-start' : 'items-start'}`}>
      <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'bg-primary' : 'bg-secondary'}`}>
        {message.role === 'assistant' ? (
          <Bot className="h-5 w-5 text-primary-foreground" />
        ) : (
          <User className="h-5 w-5 text-secondary-foreground" />
        )}
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {message.role === 'assistant' ? 'Devin' : 'You'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        
        <div className="space-y-4">
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {message.taskSteps && message.currentStep !== undefined && (
            <TaskProgress 
              steps={message.taskSteps} 
              currentStep={message.currentStep} 
            />
          )}
          
          {message.codeBlocks && message.codeBlocks.map((block, index) => (
            <CodeBlock 
              key={index} 
              code={block.code} 
              language={block.language} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
