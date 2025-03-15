# Devin AI System Documentation

## Overview

The Devin AI System is a comprehensive AI-powered software development assistant that provides a range of features to help developers with coding tasks, GitHub operations, shell command execution, and browser automation.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage Guide](#usage-guide)
5. [API Reference](#api-reference)
6. [Development Guide](#development-guide)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## System Architecture

The Devin AI System follows a modular, service-based architecture with the following components:

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.12
- **Structure**:
  - `app/api/`: API endpoints for different features
  - `app/core/`: Core configuration and utilities
  - `app/models/`: Data models and schemas
  - `app/services/`: Service implementations for business logic

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Structure**:
  - `src/api/`: API client implementations
  - `src/components/`: UI components
  - `src/types/`: TypeScript type definitions

### Integration Components

- **GitHub Integration**: Handles GitHub API operations
- **Browser Integration**: Provides browser automation capabilities
- **Shell Integration**: Manages shell command execution

## Features

### Code Generation and Review

The Code Generation feature allows you to:

- Generate code based on natural language descriptions
- Review existing code and receive suggestions
- Fix bugs and improve code quality

#### How It Works

1. Select a programming language
2. Describe the task or code requirements
3. Optionally provide additional context
4. Submit the request to generate, review, or fix code
5. View the generated code, explanations, and suggestions

### GitHub Integration

The GitHub Integration feature allows you to:

- Create and review pull requests
- Clone repositories
- Manage branches
- Analyze code changes

#### How It Works

1. Specify the repository in owner/repo format
2. Select the operation type (create PR, review PR, clone repo, etc.)
3. Provide the necessary details in JSON format
4. Execute the operation
5. View the operation results

### Shell Command Execution

The Shell Command Execution feature allows you to:

- Execute shell commands in specified directories
- Capture command output and errors
- Set environment variables for commands

#### How It Works

1. Enter the shell command to execute
2. Optionally specify a working directory
3. Execute the command
4. View the command output and any errors

### Browser Automation

The Browser Automation feature allows you to:

- Navigate to URLs
- Search for information
- Take screenshots
- Extract content from web pages

#### How It Works

1. Select the operation type (navigate, search, screenshot, etc.)
2. Provide the necessary parameters (URL, search query, etc.)
3. Execute the operation
4. View the operation results

## Installation

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- npm or pnpm

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/devin-system.git
cd devin-system

# Set up Python environment
cd backend/devin_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start the backend server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/devin_frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start the development server
npm run dev
```

## Usage Guide

### Code Generation

1. Navigate to the "Code" tab
2. Select a programming language from the dropdown
3. Enter a task description (e.g., "Create a function to calculate the factorial of a number")
4. Optionally provide additional context
5. Click "Generate Code"
6. View the generated code and explanations

### GitHub Operations

1. Navigate to the "GitHub" tab
2. Enter the repository in owner/repo format
3. Select an operation type (e.g., "Create PR")
4. Enter the operation details in JSON format
5. Click "Execute Operation"
6. View the operation results

### Shell Commands

1. Navigate to the "Shell" tab
2. Enter a shell command (e.g., "ls -la")
3. Optionally specify a working directory
4. Click "Execute Command"
5. View the command output

### Browser Operations

1. Navigate to the "Browser" tab
2. Select an operation type (e.g., "Navigate to URL")
3. Enter the required parameters (e.g., URL)
4. Click "Execute Operation"
5. View the operation results

## API Reference

### Code API

#### Generate Code

```
POST /api/code/generate
```

Request body:
```json
{
  "language": "python",
  "task": "Create a function to calculate the factorial of a number",
  "context": "Optional additional context"
}
```

#### Review Code

```
POST /api/code/review
```

Request body:
```json
{
  "language": "python",
  "code": "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)",
  "context": "Optional additional context"
}
```

#### Fix Code

```
POST /api/code/fix
```

Request body:
```json
{
  "language": "python",
  "code": "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)",
  "task": "Fix any issues in this factorial function",
  "context": "Optional additional context"
}
```

### GitHub API

#### GitHub Operations

```
POST /api/github/operations
```

Request body:
```json
{
  "repo": "owner/repo",
  "operation": "create_pr",
  "content": {
    "title": "PR Title",
    "body": "PR Description",
    "head": "feature-branch",
    "base": "main"
  }
}
```

### Shell API

#### Execute Command

```
POST /api/shell/execute
```

Request body:
```json
{
  "command": "ls -la",
  "working_directory": "/path/to/directory",
  "environment_vars": {
    "ENV_VAR1": "value1",
    "ENV_VAR2": "value2"
  }
}
```

### Browser API

#### Browser Actions

```
POST /api/browser/actions
```

Request body:
```json
{
  "operation": "navigate",
  "url": "https://example.com"
}
```

## Development Guide

### Backend Development

The backend is built with FastAPI and follows a service-based architecture:

- **API Endpoints**: Located in `app/api/` directory
- **Services**: Located in `app/services/` directory
- **Models**: Located in `app/models.py`

To add a new feature:

1. Create a new service in `app/services/`
2. Create a new API endpoint in `app/api/`
3. Update the API router in `app/api/__init__.py`
4. Add any necessary models to `app/models.py`

### Frontend Development

The frontend is built with React, TypeScript, and Vite:

- **API Clients**: Located in `src/api/` directory
- **Components**: Located in `src/components/` directory
- **Types**: Located in `src/types/` directory

To add a new feature:

1. Create any necessary types in `src/types/`
2. Add API client methods in `src/api/`
3. Create UI components in `src/components/`
4. Update the main App component in `src/App.tsx`

## Deployment

### Backend Deployment

The backend can be deployed using the following methods:

#### Fly.io Deployment

```bash
# Navigate to backend directory
cd backend/devin_backend

# Deploy to Fly.io
<deploy_backend dir="/path/to/backend/devin_backend"/>
```

### Frontend Deployment

The frontend can be deployed using the following methods:

#### Static Site Deployment

```bash
# Navigate to frontend directory
cd frontend/devin_frontend

# Build the frontend
npm run build

# Deploy the build directory
<deploy_frontend dir="/path/to/frontend/devin_frontend/dist"/>
```

## Troubleshooting

### Common Issues

#### Backend Issues

- **API Key Configuration**: Ensure all required API keys are set in the `.env` file
- **Database Connection**: Verify database connection string is correct
- **CORS Issues**: Check CORS configuration in `main.py`

#### Frontend Issues

- **API Connection**: Verify the backend URL is correctly set in `.env`
- **Build Errors**: Check for TypeScript errors or missing dependencies
- **UI Issues**: Verify all UI components are properly imported and used

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the GitHub repository issues
2. Review the FastAPI and React documentation
3. Contact the development team for assistance
