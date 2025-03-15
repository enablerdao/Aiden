# Aiden AI System User Guide

## Introduction

Welcome to the Aiden AI System, an AI-powered software development assistant designed to help you with coding tasks, GitHub operations, shell command execution, and browser automation.

This guide will walk you through how to use the system effectively to boost your productivity as a developer.

## Getting Started

The Aiden AI System is accessible through a web interface at:

- **Frontend URL**: https://devin-clone-app-nikz67cu.devinapps.com
- **Backend API**: https://app-qwisyttw.fly.dev

No installation is required to use the web interface. Simply navigate to the URL in your web browser to get started.

## Main Features

The Aiden AI System offers four main features, accessible through tabs in the user interface:

1. **Code**: Generate, review, and fix code
2. **GitHub**: Interact with GitHub repositories
3. **Shell**: Execute shell commands
4. **Browser**: Navigate and search the web

Let's explore each feature in detail.

## Code Generation and Review

The Code tab allows you to generate code based on natural language descriptions, review existing code, and fix bugs.

### Generating Code

To generate code:

1. Select the programming language from the dropdown (e.g., Python, JavaScript, TypeScript)
2. Enter a task description in the "Task Description" field (e.g., "Create a function to calculate the factorial of a number")
3. Optionally provide additional context in the "Additional Context" field
4. Click the "Generate Code" button
5. View the generated code and explanations in the right panel

### Example Task Descriptions

- "Create a function to calculate the Fibonacci sequence up to n terms"
- "Write a class for managing a simple to-do list with add, remove, and list methods"
- "Implement a binary search algorithm for a sorted array"

### Tips for Better Code Generation

- Be specific about what you want the code to do
- Mention edge cases that should be handled
- Specify any performance requirements
- Mention the programming paradigm if relevant (e.g., functional, object-oriented)

## GitHub Integration

The GitHub tab allows you to interact with GitHub repositories, including creating pull requests, reviewing code, cloning repositories, and managing branches.

### Using GitHub Operations

To use GitHub operations:

1. Enter the repository in owner/repo format (e.g., "octocat/Hello-World")
2. Select an operation type from the dropdown (e.g., "Create PR", "Review PR")
3. Enter the operation details in JSON format in the "Content" field
4. Click the "Execute Operation" button
5. View the operation results in the right panel

### Example Operations

#### Creating a Pull Request

```json
{
  "title": "Add new feature",
  "body": "This PR adds a new feature that...",
  "head": "feature-branch",
  "base": "main"
}
```

#### Reviewing a Pull Request

```json
{
  "pr_number": 123,
  "comment": "This looks good, but consider optimizing the algorithm."
}
```

#### Creating a Branch

```json
{
  "branch_name": "feature/new-feature",
  "base_branch": "main"
}
```

## Shell Command Execution

The Shell tab allows you to execute shell commands and view their output.

### Executing Commands

To execute shell commands:

1. Enter the command in the "Command" field (e.g., "ls -la")
2. Optionally specify a working directory in the "Working Directory" field
3. Click the "Execute Command" button
4. View the command output in the right panel

### Example Commands

- `ls -la`: List all files in the current directory with details
- `git status`: Check the status of a Git repository
- `npm install`: Install Node.js dependencies
- `python -m venv venv`: Create a Python virtual environment

### Tips for Shell Commands

- Use absolute paths when specifying files or directories
- Be careful with commands that modify the system
- For long-running commands, be patient as the output may take time to appear

## Browser Automation

The Browser tab allows you to navigate to URLs, search for information, take screenshots, and extract content from web pages.

### Using Browser Operations

To use browser operations:

1. Select an operation type from the dropdown (e.g., "Navigate to URL", "Search")
2. Enter the required parameters (e.g., URL, search query)
3. Click the "Execute Operation" button
4. View the operation results in the right panel

### Example Operations

#### Navigating to a URL

1. Select "Navigate to URL" from the dropdown
2. Enter "https://example.com" in the URL field
3. Click "Execute Operation"
4. View the page content in the response

#### Searching for Information

1. Select "Search" from the dropdown
2. Enter "Python tutorial" in the query field
3. Click "Execute Operation"
4. View the search results in the response

## Advanced Usage

### Combining Features

The real power of the Aiden AI System comes from combining its features. Here are some examples:

1. **Code Generation + GitHub**:
   - Generate code for a new feature
   - Create a new branch and commit the code
   - Create a pull request for review

2. **Shell + Browser**:
   - Execute a command to start a local server
   - Navigate to the local server URL to test the application
   - Take screenshots for documentation

3. **Code Review + GitHub**:
   - Review code in a pull request
   - Generate suggestions for improvements
   - Comment on the pull request with the suggestions

## Troubleshooting

### Common Issues

- **API Connection Errors**: If you see connection errors, the backend may be temporarily unavailable. Try refreshing the page or coming back later.
- **Invalid Input Errors**: Make sure your inputs are correctly formatted, especially JSON content for GitHub operations.
- **Operation Timeouts**: Some operations may take time to complete. Be patient and check the response after a few moments.

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the documentation for more detailed information
2. Contact the system administrators for assistance

## Conclusion

The Aiden AI System is designed to make your development workflow more efficient by automating common tasks and providing AI-powered assistance. By mastering its features, you can significantly boost your productivity as a developer.

Happy coding!
