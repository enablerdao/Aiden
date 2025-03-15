// API Response and Request Types

export interface CodeRequest {
  code?: string;
  language: string;
  task: string;
  context?: string;
}

export interface CodeResponse {
  code: string;
  explanation?: string;
  suggestions?: string[];
}

export interface GitHubRequest {
  repo: string;
  operation: string;
  content: Record<string, any>;
}

export interface GitHubResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

export interface ShellRequest {
  command: string;
  workingDirectory?: string;
  environmentVars?: Record<string, string>;
}

export interface ShellResponse {
  success: boolean;
  output: string;
  error?: string;
}

export interface BrowserRequest {
  url?: string;
  operation: string;
  parameters?: Record<string, any>;
}

export interface BrowserResponse {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}
