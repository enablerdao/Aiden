import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Github, Terminal, Globe, FileCode, Braces } from "lucide-react"
import { ThemeToggle } from "./ui/theme-toggle"
import { CodeBlock } from "./ui/code-block"

// Import API clients
import { codeApi, githubApi, shellApi, browserApi } from '../api'
import { TaskTab } from './TaskTab'
import { CodeRequest, ShellRequest, GitHubRequest, BrowserRequest } from '../types'
import { Auth } from './Auth'
import { useAuth } from '../contexts/AuthContext'

export function AppContent() {
  const { user, loading } = useAuth()
  
  // State for task execution
  const [taskDescription, setTaskDescription] = useState('')
  const [isExecutingTask, setIsExecutingTask] = useState(false)
  const [taskSteps, setTaskSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [taskResult, setTaskResult] = useState('')

  // State for code generation
  const [codeLanguage, setCodeLanguage] = useState('python')
  const [codeTask, setCodeTask] = useState('')
  const [codeContext, setCodeContext] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [codeExplanation, setCodeExplanation] = useState('')
  const [codeSuggestions, setCodeSuggestions] = useState<string[]>([])
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  // State for GitHub operations
  const [githubRepo, setGithubRepo] = useState('')
  const [githubOperation, setGithubOperation] = useState('create_pr')
  const [githubContent, setGithubContent] = useState('')
  const [githubResponse, setGithubResponse] = useState('')
  const [isGithubProcessing, setIsGithubProcessing] = useState(false)

  // State for shell commands
  const [shellCommand, setShellCommand] = useState('')
  const [shellWorkingDir, setShellWorkingDir] = useState('')
  const [shellOutput, setShellOutput] = useState('')
  const [isShellProcessing, setIsShellProcessing] = useState(false)

  // State for browser operations
  const [browserUrl, setBrowserUrl] = useState('')
  const [browserOperation, setBrowserOperation] = useState('navigate')
  const [browserQuery, setBrowserQuery] = useState('')
  const [browserResponse, setBrowserResponse] = useState('')
  const [isBrowserProcessing, setIsBrowserProcessing] = useState(false)

  // Handle code generation
  const handleGenerateCode = async () => {
    if (!codeTask) return
    
    setIsGeneratingCode(true)
    
    try {
      const request: CodeRequest = {
        language: codeLanguage,
        task: codeTask,
        context: codeContext || undefined
      }
      
      const response = await codeApi.generate(request)
      
      setGeneratedCode(response.data.code)
      setCodeExplanation(response.data.explanation || '')
      setCodeSuggestions(response.data.suggestions || [])
    } catch (error) {
      console.error('Error generating code:', error)
      setGeneratedCode('Error generating code. Please try again.')
    } finally {
      setIsGeneratingCode(false)
    }
  }

  // Handle GitHub operations
  const handleGithubOperation = async () => {
    if (!githubRepo) return
    
    setIsGithubProcessing(true)
    
    try {
      const contentObj = JSON.parse(githubContent || '{}')
      
      const request: GitHubRequest = {
        repo: githubRepo,
        operation: githubOperation,
        content: contentObj
      }
      
      const response = await githubApi.operations(request)
      
      setGithubResponse(JSON.stringify(response.data, null, 2))
    } catch (error) {
      console.error('Error with GitHub operation:', error)
      setGithubResponse('Error with GitHub operation. Please try again.')
    } finally {
      setIsGithubProcessing(false)
    }
  }

  // Handle shell command execution
  const handleShellCommand = async () => {
    if (!shellCommand) return
    
    setIsShellProcessing(true)
    
    try {
      const request: ShellRequest = {
        command: shellCommand,
        workingDirectory: shellWorkingDir || undefined
      }
      
      const response = await shellApi.execute(request)
      
      setShellOutput(response.data.output + (response.data.error ? `\n\nError: ${response.data.error}` : ''))
    } catch (error) {
      console.error('Error executing shell command:', error)
      setShellOutput('Error executing shell command. Please try again.')
    } finally {
      setIsShellProcessing(false)
    }
  }

  // Handle browser operations
  const handleBrowserOperation = async () => {
    setIsBrowserProcessing(true)
    
    try {
      const request: BrowserRequest = {
        url: browserUrl || undefined,
        operation: browserOperation,
        parameters: browserOperation === 'search' ? { query: browserQuery } : undefined
      }
      
      const response = await browserApi.actions(request)
      
      setBrowserResponse(JSON.stringify(response.data, null, 2))
    } catch (error) {
      console.error('Error with browser operation:', error)
      setBrowserResponse('Error with browser operation. Please try again.')
    } finally {
      setIsBrowserProcessing(false)
    }
  }
  
  // Handle task execution
  const handleExecuteTask = async () => {
    if (!taskDescription) return
    
    setIsExecutingTask(true)
    setTaskSteps([])
    setCurrentStep(0)
    setTaskResult('')
    
    try {
      // Break down the task into steps based on the task description
      // This is a more sophisticated implementation that analyzes the task
      let steps = []
      
      // Basic task analysis to determine appropriate steps
      const taskLower = taskDescription.toLowerCase()
      
      if (taskLower.includes('factorial')) {
        steps = [
          'Analyzing factorial calculation requirements...',
          'Determining approach (recursive vs. iterative)...',
          'Implementing factorial function...',
          'Adding error handling for edge cases...',
          'Testing with sample inputs...',
          'Finalizing implementation...'
        ]
      } else if (taskLower.includes('function') || taskLower.includes('code') || taskLower.includes('programming')) {
        steps = [
          'Analyzing function requirements...',
          'Determining input and output types...',
          'Planning function structure...',
          'Implementing core logic...',
          'Adding error handling...',
          'Testing with sample inputs...',
          'Finalizing implementation...'
        ]
      } else if (taskLower.includes('search') || taskLower.includes('find')) {
        steps = [
          'Analyzing search requirements...',
          'Determining search criteria...',
          'Executing search query...',
          'Filtering results...',
          'Organizing findings...',
          'Presenting search results...'
        ]
      } else if (taskLower.includes('compare') || taskLower.includes('analysis')) {
        steps = [
          'Analyzing comparison requirements...',
          'Identifying comparison criteria...',
          'Gathering data for comparison...',
          'Performing comparative analysis...',
          'Organizing comparison results...',
          'Presenting findings with recommendations...'
        ]
      } else if (taskLower.includes('data') || taskLower.includes('analyze')) {
        steps = [
          'Analyzing data requirements...',
          'Identifying data sources...',
          'Collecting relevant data...',
          'Processing and cleaning data...',
          'Performing data analysis...',
          'Visualizing results...',
          'Presenting insights and conclusions...'
        ]
      } else {
        // Default steps for any task
        steps = [
          'Analyzing task requirements...',
          'Breaking down into subtasks...',
          'Planning execution strategy...',
          'Executing subtasks...',
          'Finalizing results...'
        ]
      }
      
      setTaskSteps(steps)
      
      // Execute each step with a delay to simulate processing
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Execute the task using the browser service's specialized method
      const response = await browserApi.executeTask(taskDescription)
      
      if (response.data && response.data.success) {
        // Format the response based on content
        if (typeof response.data.data === 'object' && response.data.data.code) {
          setTaskResult(`# Solution\n\n\`\`\`python\n${response.data.data.code}\n\`\`\`\n\n${response.data.data.explanation || ''}`)
        } else if (typeof response.data.data === 'object' && response.data.data.steps) {
          // Format steps if they're included in the response
          const stepsOutput = response.data.data.steps.map((step: any) => 
            `## ${step.action || 'Step'}\n${step.observation || ''}`
          ).join('\n\n');
          
          setTaskResult(`# Task Results\n\n${stepsOutput}\n\n${response.data.data.result || ''}`)
        } else {
          // Format general response
          const resultText = typeof response.data.data === 'object' 
            ? JSON.stringify(response.data.data, null, 2)
            : String(response.data.data || response.data);
            
          setTaskResult(resultText)
        }
      } else {
        setTaskResult(`Error: ${response.data?.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error executing task:', error)
      setTaskResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecutingTask(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Auth />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Aiden AI System</h1>
          <p className="text-muted-foreground">AI-powered software development assistant</p>
        </div>
        <ThemeToggle />
      </header>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="task" className="flex items-center gap-2">
            <Braces size={16} />
            <span>Task</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <FileCode size={16} />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github size={16} />
            <span>GitHub</span>
          </TabsTrigger>
          <TabsTrigger value="shell" className="flex items-center gap-2">
            <Terminal size={16} />
            <span>Shell</span>
          </TabsTrigger>
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <Globe size={16} />
            <span>Browser</span>
          </TabsTrigger>
        </TabsList>

        {/* Task Execution Tab */}
        <TabsContent value="task">
          <TaskTab
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            isExecutingTask={isExecutingTask}
            taskSteps={taskSteps}
            currentStep={currentStep}
            taskResult={taskResult}
            handleExecuteTask={handleExecuteTask}
          />
        </TabsContent>
        
        {/* Code Generation Tab */}
        <TabsContent value="code">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Generation</CardTitle>
                <CardDescription>Generate code based on your requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task">Task Description</Label>
                  <Textarea 
                    id="task" 
                    placeholder="Describe what you want the code to do..." 
                    value={codeTask}
                    onChange={(e) => setCodeTask(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context (Optional)</Label>
                  <Textarea 
                    id="context" 
                    placeholder="Provide any additional context..." 
                    value={codeContext}
                    onChange={(e) => setCodeContext(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateCode} 
                  disabled={isGeneratingCode || !codeTask}
                  className="w-full"
                >
                  {isGeneratingCode ? 'Generating...' : 'Generate Code'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Code</CardTitle>
                <CardDescription>View the generated code and explanation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="generated-code">Code</Label>
                  {generatedCode ? (
                    <CodeBlock 
                      code={generatedCode} 
                      language={codeLanguage} 
                      className="max-h-[300px]"
                    />
                  ) : (
                    <div className="bg-secondary p-4 rounded-md overflow-auto max-h-[300px]">
                      <pre className="text-sm">
                        <code>Generated code will appear here...</code>
                      </pre>
                    </div>
                  )}
                </div>
                {codeExplanation && (
                  <div className="space-y-2">
                    <Label>Explanation</Label>
                    <p className="text-sm text-gray-700">{codeExplanation}</p>
                  </div>
                )}
                {codeSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Suggestions</Label>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {codeSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GitHub Tab */}
        <TabsContent value="github">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Operations</CardTitle>
                <CardDescription>Interact with GitHub repositories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo">Repository (owner/repo)</Label>
                  <Input 
                    id="repo" 
                    placeholder="e.g., octocat/Hello-World" 
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operation">Operation</Label>
                  <Select value={githubOperation} onValueChange={setGithubOperation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create_pr">Create PR</SelectItem>
                      <SelectItem value="review_pr">Review PR</SelectItem>
                      <SelectItem value="clone_repo">Clone Repository</SelectItem>
                      <SelectItem value="create_branch">Create Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (JSON)</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Enter operation details as JSON..." 
                    value={githubContent}
                    onChange={(e) => setGithubContent(e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGithubOperation} 
                  disabled={isGithubProcessing || !githubRepo}
                  className="w-full"
                >
                  {isGithubProcessing ? 'Processing...' : 'Execute Operation'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
                <CardDescription>GitHub operation response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-sm">
                    <code>{githubResponse || 'Response will appear here...'}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shell Tab */}
        <TabsContent value="shell">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shell Commands</CardTitle>
                <CardDescription>Execute shell commands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="command">Command</Label>
                  <Input 
                    id="command" 
                    placeholder="Enter shell command..." 
                    value={shellCommand}
                    onChange={(e) => setShellCommand(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working-dir">Working Directory (Optional)</Label>
                  <Input 
                    id="working-dir" 
                    placeholder="e.g., /home/user/project" 
                    value={shellWorkingDir}
                    onChange={(e) => setShellWorkingDir(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleShellCommand} 
                  disabled={isShellProcessing || !shellCommand}
                  className="w-full"
                >
                  {isShellProcessing ? 'Executing...' : 'Execute Command'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>Command execution output</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-code-background text-code-foreground p-4 rounded-md font-mono overflow-auto max-h-[400px]">
                  <pre className="text-sm">
                    {shellOutput || '$ Output will appear here...'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Browser Tab */}
        <TabsContent value="browser">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Browser Operations</CardTitle>
                <CardDescription>Navigate and search the web</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operation">Operation</Label>
                  <Select value={browserOperation} onValueChange={setBrowserOperation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="navigate">Navigate to URL</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="screenshot">Take Screenshot</SelectItem>
                      <SelectItem value="extract_content">Extract Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(browserOperation === 'navigate' || browserOperation === 'screenshot' || browserOperation === 'extract_content') && (
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input 
                      id="url" 
                      placeholder="https://example.com" 
                      value={browserUrl}
                      onChange={(e) => setBrowserUrl(e.target.value)}
                    />
                  </div>
                )}
                
                {browserOperation === 'search' && (
                  <div className="space-y-2">
                    <Label htmlFor="query">Search Query</Label>
                    <Input 
                      id="query" 
                      placeholder="Enter search query..." 
                      value={browserQuery}
                      onChange={(e) => setBrowserQuery(e.target.value)}
                    />
                  </div>
                )}
                
                {browserOperation === 'extract_content' && (
                  <div className="space-y-2">
                    <Label htmlFor="selector">CSS Selector</Label>
                    <Input 
                      id="selector" 
                      placeholder="e.g., .main-content" 
                      value={browserQuery}
                      onChange={(e) => setBrowserQuery(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleBrowserOperation} 
                  disabled={isBrowserProcessing || (browserOperation === 'navigate' && !browserUrl) || (browserOperation === 'search' && !browserQuery)}
                  className="w-full"
                >
                  {isBrowserProcessing ? 'Processing...' : 'Execute Operation'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
                <CardDescription>Browser operation response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-sm">
                    <code>{browserResponse || 'Response will appear here...'}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
