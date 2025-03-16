import { useState } from 'react';
import { CodeBlock } from './ui/code-block';
import { TaskProgress } from './TaskProgress';
import { Avatar } from './ui/avatar';
import { User, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {message.role === 'assistant' ? 'Aiden' : 'You'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          {isMobile && (
            <button 
              onClick={toggleCollapse} 
              className="p-1 rounded-md hover:bg-secondary/50"
              aria-label={isCollapsed ? "Expand message" : "Collapse message"}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        
        {(!isMobile || !isCollapsed) && (
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
        )}
        {isMobile && isCollapsed && (
          <div className="text-sm text-muted-foreground italic">
            {message.content.length > 60 
              ? message.content.substring(0, 60) + '...' 
              : message.content}
          </div>
        )}
      </div>
    </div>
  );
}
