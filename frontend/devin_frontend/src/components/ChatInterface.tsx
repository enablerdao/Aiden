import { useState, useRef, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Send, RotateCcw } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

// Mock API for now - will be replaced with actual API
const browserApi = {
  executeTask: async (_task: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      data: {
        success: true,
        data: {
          code: `def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    else:\n        return n * factorial(n-1)`,
          explanation: "This is a recursive implementation of the factorial function. It handles the base cases (0 and 1) and recursively calculates the factorial for larger numbers.",
          steps: [],
          result: ""
        }
      }
    };
  }
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskSteps?: string[];
  currentStep?: number;
  codeBlocks?: { language: string; code: string }[];
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsExecuting(true);
    
    try {
      // Break down the task into steps based on the task description
      const steps = generateTaskSteps(input);
      
      // Add initial assistant message with task steps
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'll help you with that. Breaking this down into steps:",
        timestamp: new Date(),
        taskSteps: steps,
        currentStep: 0,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Execute each step with a delay to simulate processing
      for (let i = 0; i < steps.length; i++) {
        // Update current step
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, currentStep: i } 
              : msg
          )
        );
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Execute the task using the browser service's specialized method
      const response = await browserApi.executeTask(input);
      
      if (response.data && response.data.success) {
        // Format the response and update the assistant message
        let resultContent = '';
        let codeBlocks: Array<{language: string, code: string}> = [];
        
        if (typeof response.data.data === 'object' && response.data.data.code) {
          resultContent = `Task completed successfully. Here's the solution:`;
          codeBlocks = [{
            language: 'python',
            code: response.data.data.code
          }];
          
          if (response.data.data.explanation) {
            resultContent += `\n\n${response.data.data.explanation}`;
          }
        } else if (typeof response.data.data === 'object' && response.data.data.steps) {
          // Format steps if they're included in the response
          resultContent = 'Task completed successfully. Here are the results:';
          
          response.data.data.steps.forEach((step: any) => {
            resultContent += `\n\n## ${step.action || 'Step'}\n${step.observation || ''}`;
          });
          
          if (response.data.data.result) {
            resultContent += `\n\n${response.data.data.result}`;
          }
        } else {
          // Format general response
          resultContent = 'Task completed successfully. Here are the results:';
          
          const resultText = typeof response.data.data === 'object' 
            ? JSON.stringify(response.data.data, null, 2)
            : String(response.data.data || response.data);
            
          codeBlocks = [{
            language: 'json',
            code: resultText
          }];
        }
        
        // Update the assistant message with the results
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { 
                  ...msg, 
                  content: resultContent, 
                  currentStep: steps.length - 1,
                  codeBlocks
                } 
              : msg
          )
        );
      } else {
        // Update the assistant message with the error
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { 
                  ...msg, 
                  content: `Error: Unknown error`,
                  currentStep: steps.length - 1
                } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error executing task:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Generate task steps based on the task description
  const generateTaskSteps = (task: string): string[] => {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('factorial')) {
      return [
        'Analyzing factorial calculation requirements...',
        'Determining approach (recursive vs. iterative)...',
        'Implementing factorial function...',
        'Adding error handling for edge cases...',
        'Testing with sample inputs...',
        'Finalizing implementation...'
      ];
    } else if (taskLower.includes('function') || taskLower.includes('code') || taskLower.includes('programming')) {
      return [
        'Analyzing function requirements...',
        'Determining input and output types...',
        'Planning function structure...',
        'Implementing core logic...',
        'Adding error handling...',
        'Testing with sample inputs...',
        'Finalizing implementation...'
      ];
    } else if (taskLower.includes('search') || taskLower.includes('find')) {
      return [
        'Analyzing search requirements...',
        'Determining search criteria...',
        'Executing search query...',
        'Filtering results...',
        'Organizing findings...',
        'Presenting search results...'
      ];
    } else if (taskLower.includes('compare') || taskLower.includes('analysis')) {
      return [
        'Analyzing comparison requirements...',
        'Identifying comparison criteria...',
        'Gathering data for comparison...',
        'Performing comparative analysis...',
        'Organizing comparison results...',
        'Presenting findings with recommendations...'
      ];
    } else if (taskLower.includes('data') || taskLower.includes('analyze')) {
      return [
        'Analyzing data requirements...',
        'Identifying data sources...',
        'Collecting relevant data...',
        'Processing and cleaning data...',
        'Performing data analysis...',
        'Visualizing results...',
        'Presenting insights and conclusions...'
      ];
    } else {
      // Default steps for any task
      return [
        'Analyzing task requirements...',
        'Breaking down into subtasks...',
        'Planning execution strategy...',
        'Executing subtasks...',
        'Finalizing results...'
      ];
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-2xl font-bold mb-2">Welcome to Devin AI System</h2>
            <p className="text-muted-foreground mb-4">
              Your AI-powered software development assistant
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Type a task below to get started. Devin can help you with coding tasks, 
              debugging, code reviews, and more.
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your task here..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isExecuting}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isExecuting}
            className="h-10 w-10 p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            className="h-10 w-10 p-0"
            title="Take control"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
