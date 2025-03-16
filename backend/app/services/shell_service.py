"""
Shell command execution service.
"""
import os
import subprocess
from typing import Dict, Optional, Tuple

class ShellService:
    async def execute_command(
        self, 
        command: str, 
        working_directory: Optional[str] = None,
        environment_vars: Optional[Dict[str, str]] = None
    ) -> Tuple[bool, str, Optional[str]]:
        """
        Execute a shell command and return the result.
        
        Args:
            command: Shell command to execute
            working_directory: Directory to execute the command in
            environment_vars: Additional environment variables
            
        Returns:
            Tuple of (success, output, error)
        """
        try:
            # Set up environment variables
            env = os.environ.copy()
            if environment_vars:
                env.update(environment_vars)
            
            # Set working directory
            cwd = working_directory if working_directory else None
            
            # Execute the command
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=cwd,
                env=env
            )
            
            stdout, stderr = process.communicate()
            
            return (process.returncode == 0, stdout, stderr if stderr else None)
        except Exception as e:
            return (False, "", str(e))


# Create a singleton instance
shell_service = ShellService()
