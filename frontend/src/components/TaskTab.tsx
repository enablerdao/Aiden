// Component imports
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Progress } from "../components/ui/progress"
import { CodeBlock } from "../components/ui/code-block"
import { useState, useEffect } from "react"

type TaskTabProps = {
  taskDescription: string
  setTaskDescription: (value: string) => void
  isExecutingTask: boolean
  taskSteps: string[]
  currentStep: number
  taskResult: string
  handleExecuteTask: () => void
}

export function TaskTab({
  taskDescription,
  setTaskDescription,
  isExecutingTask,
  taskSteps,
  currentStep,
  taskResult,
  handleExecuteTask
}: TaskTabProps) {
  const progress = taskSteps.length > 0 ? ((currentStep + 1) / taskSteps.length) * 100 : 0
  const [codeBlocks, setCodeBlocks] = useState<{code: string, language: string}[]>([]);

  useEffect(() => {
    if (taskResult) {
      // Extract code blocks from markdown-like syntax
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const extractedBlocks: {code: string, language: string}[] = [];
      let match;
      
      while ((match = codeBlockRegex.exec(taskResult)) !== null) {
        extractedBlocks.push({
          language: match[1] || 'text',
          code: match[2]
        });
      }
      
      setCodeBlocks(extractedBlocks);
    }
  }, [taskResult]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Task Execution</CardTitle>
          <CardDescription>Describe a task and let Devin execute it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-description">Task Description</Label>
            <Textarea
              id="task-description"
              placeholder="Describe what you want Devin to do..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={6}
              disabled={isExecutingTask}
              className="bg-background border-input"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleExecuteTask}
            disabled={isExecutingTask || !taskDescription}
            className="w-full"
          >
            {isExecutingTask ? 'Executing...' : 'Execute Task'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>View the progress and results of your task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isExecutingTask && taskSteps.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="space-y-2">
                <Label>Current Step</Label>
                <div className="bg-secondary p-3 rounded-md">
                  <p className="text-sm font-medium">{taskSteps[currentStep]}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Steps</Label>
                <ul className="space-y-1">
                  {taskSteps.map((step, index) => (
                    <li key={index} className="text-sm">
                      <span className={`mr-2 ${index === currentStep ? 'text-primary font-medium' : index < currentStep ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {index < currentStep ? '✓' : index === currentStep ? '►' : '○'}
                      </span>
                      <span className={index === currentStep ? 'font-medium' : ''}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {taskResult && (
            <div className="space-y-4">
              <Label>Result</Label>
              {codeBlocks.length > 0 ? (
                <div className="space-y-4">
                  {/* Display text content before code blocks */}
                  {taskResult.split(/```(\w+)?\n[\s\S]*?```/).filter(Boolean).map((text, i) => (
                    <p key={`text-${i}`} className="text-sm whitespace-pre-wrap">{text}</p>
                  ))}
                  
                  {/* Display code blocks */}
                  {codeBlocks.map((block, index) => (
                    <CodeBlock 
                      key={index} 
                      code={block.code} 
                      language={block.language} 
                      className="mt-2"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-secondary p-4 rounded-md overflow-auto max-h-[300px]">
                  <pre className="text-sm whitespace-pre-wrap">
                    <code>{taskResult}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
          
          {!isExecutingTask && !taskResult && !taskSteps.length && (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p>Task execution results will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
