"""
Code generation, review, and fixing service.
"""
from typing import List, Optional
import os
import re
import anthropic
from app.core.config import settings

class CodeService:
    def __init__(self):
        self.anthropic_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-opus-20240229"
    
    async def generate_code(
        self, 
        language: str, 
        task: str, 
        context: Optional[str] = None
    ) -> dict:
        """
        Generate code based on the provided task and context.
        
        Args:
            language: Programming language to generate code in
            task: Description of what the code should do
            context: Additional context for code generation
            
        Returns:
            Dictionary with generated code, explanation, and suggestions
        """
        prompt = f"""
You are an expert {language} programmer. Generate code for the following task:

Task: {task}
"""
        
        if context:
            prompt += f"\nAdditional context: {context}\n"
        
        prompt += """
Please provide:
1. Well-written, efficient, and correct code that solves the task
2. A brief explanation of how the code works
3. A list of suggestions for improvements or considerations

Format your response as follows:
```{language}
[Your code here]
```

Explanation: [Your explanation here]

Suggestions:
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]
"""
        
        try:
            response = self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=2000,
                temperature=0.2,
                system="You are an expert programmer who writes clean, efficient, and well-documented code.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.content[0].text
            
            # Parse the response to extract code, explanation, and suggestions
            code_block = ""
            explanation = ""
            suggestions = []
            
            # Extract code between triple backticks
            import re
            code_match = re.search(r"```.*?\n(.*?)```", content, re.DOTALL)
            if code_match:
                code_block = code_match.group(1).strip()
            
            # Extract explanation
            explanation_match = re.search(r"Explanation: (.*?)(?=\n\nSuggestions:|\Z)", content, re.DOTALL)
            if explanation_match:
                explanation = explanation_match.group(1).strip()
            
            # Extract suggestions
            suggestions_match = re.search(r"Suggestions:\s*\n(.*?)(?=\Z)", content, re.DOTALL)
            if suggestions_match:
                suggestions_text = suggestions_match.group(1)
                suggestions = [s.strip()[2:].strip() for s in suggestions_text.split('\n') if s.strip().startswith('-')]
            
            return {
                "code": code_block,
                "explanation": explanation,
                "suggestions": suggestions
            }
        except Exception as e:
            # Fallback to a simple implementation if API call fails
            return {
                "code": f"# Error generating code: {str(e)}",
                "explanation": "An error occurred while generating code.",
                "suggestions": ["Try again with a more specific task description."]
            }
    
    async def review_code(
        self, 
        code: str, 
        language: str, 
        context: Optional[str] = None
    ) -> dict:
        """
        Review the provided code and offer suggestions.
        
        Args:
            code: Code to review
            language: Programming language of the code
            context: Additional context for code review
            
        Returns:
            Dictionary with review results
        """
        prompt = f"""
You are an expert code reviewer for {language}. Review the following code:

```{language}
{code}
```
"""
        
        if context:
            prompt += f"\nAdditional context: {context}\n"
        
        prompt += """
Please provide:
1. A brief explanation of what the code does
2. A list of suggestions for improvements, including any bugs, performance issues, or style improvements

Format your response as follows:
Explanation: [Your explanation here]

Suggestions:
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]
"""
        
        try:
            response = self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=1500,
                temperature=0.2,
                system="You are an expert code reviewer who identifies bugs, performance issues, and style improvements.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.content[0].text
            
            # Parse the response to extract explanation and suggestions
            explanation = ""
            suggestions = []
            
            # Extract explanation
            explanation_match = re.search(r"Explanation: (.*?)(?=\n\nSuggestions:|\Z)", content, re.DOTALL)
            if explanation_match:
                explanation = explanation_match.group(1).strip()
            
            # Extract suggestions
            suggestions_match = re.search(r"Suggestions:\s*\n(.*?)(?=\Z)", content, re.DOTALL)
            if suggestions_match:
                suggestions_text = suggestions_match.group(1)
                suggestions = [s.strip()[2:].strip() for s in suggestions_text.split('\n') if s.strip().startswith('-')]
            
            return {
                "code": code,
                "explanation": explanation,
                "suggestions": suggestions
            }
        except Exception as e:
            # Fallback to a simple implementation if API call fails
            return {
                "code": code,
                "explanation": f"Error reviewing code: {str(e)}",
                "suggestions": ["Try again with a more specific context."]
            }
    
    async def fix_code(
        self, 
        code: str, 
        language: str, 
        task: str, 
        context: Optional[str] = None
    ) -> dict:
        """
        Fix issues in the provided code.
        
        Args:
            code: Code to fix
            language: Programming language of the code
            task: Description of what the code should do
            context: Additional context for code fixing
            
        Returns:
            Dictionary with fixed code and explanation
        """
        prompt = f"""
You are an expert {language} programmer. Fix the following code that is intended to {task}:

```{language}
{code}
```
"""
        
        if context:
            prompt += f"\nAdditional context: {context}\n"
        
        prompt += """
Please provide:
1. The fixed code
2. An explanation of what was wrong and how you fixed it
3. A list of suggestions for further improvements

Format your response as follows:
```{language}
[Your fixed code here]
```

Explanation: [Your explanation here]

Suggestions:
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]
"""
        
        try:
            response = self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=2000,
                temperature=0.2,
                system="You are an expert programmer who fixes bugs and improves code quality.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.content[0].text
            
            # Parse the response to extract code, explanation, and suggestions
            fixed_code = ""
            explanation = ""
            suggestions = []
            
            # Extract code between triple backticks
            import re
            code_match = re.search(r"```.*?\n(.*?)```", content, re.DOTALL)
            if code_match:
                fixed_code = code_match.group(1).strip()
            
            # Extract explanation
            explanation_match = re.search(r"Explanation: (.*?)(?=\n\nSuggestions:|\Z)", content, re.DOTALL)
            if explanation_match:
                explanation = explanation_match.group(1).strip()
            
            # Extract suggestions
            suggestions_match = re.search(r"Suggestions:\s*\n(.*?)(?=\Z)", content, re.DOTALL)
            if suggestions_match:
                suggestions_text = suggestions_match.group(1)
                suggestions = [s.strip()[2:].strip() for s in suggestions_text.split('\n') if s.strip().startswith('-')]
            
            return {
                "code": fixed_code if fixed_code else code,
                "explanation": explanation,
                "suggestions": suggestions
            }
        except Exception as e:
            # Fallback to a simple implementation if API call fails
            return {
                "code": code,
                "explanation": f"Error fixing code: {str(e)}",
                "suggestions": ["Try again with a more specific task description."]
            }


# Create a singleton instance
code_service = CodeService()
