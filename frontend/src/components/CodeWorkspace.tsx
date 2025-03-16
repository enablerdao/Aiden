import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from './ui/theme-provider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
};

export function CodeWorkspace() {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      name: 'aiden-system',
      path: '/home/ubuntu/aiden-system',
      type: 'directory',
      expanded: true,
      children: [
        {
          name: 'frontend',
          path: '/home/ubuntu/aiden-system/frontend',
          type: 'directory',
          expanded: true,
          children: [
            {
              name: 'src',
              path: '/home/ubuntu/aiden-system/frontend/src',
              type: 'directory',
              expanded: true,
              children: [
                {
                  name: 'App.tsx',
                  path: '/home/ubuntu/aiden-system/frontend/src/App.tsx',
                  type: 'file'
                },
                {
                  name: 'main.tsx',
                  path: '/home/ubuntu/aiden-system/frontend/src/main.tsx',
                  type: 'file'
                },
                {
                  name: 'index.css',
                  path: '/home/ubuntu/aiden-system/frontend/src/index.css',
                  type: 'file'
                }
              ]
            }
          ]
        },
        {
          name: 'backend',
          path: '/home/ubuntu/aiden-system/backend',
          type: 'directory',
          expanded: false,
          children: [
            {
              name: 'app',
              path: '/home/ubuntu/aiden-system/backend/app',
              type: 'directory',
              children: [
                {
                  name: 'main.py',
                  path: '/home/ubuntu/aiden-system/backend/app/main.py',
                  type: 'file'
                }
              ]
            }
          ]
        }
      ]
    }
  ]);
  
  const toggleDirectory = (path: string) => {
    setFileTree(prevTree => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            return { ...node, expanded: !node.expanded };
          } else if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      
      return updateNode(prevTree);
    });
  };
  
  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    // In a real implementation, this would fetch the file content from the backend
    setFileContent(`// File content for ${path}\n// This is a placeholder for the actual file content`);
  };
  
  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.path} style={{ paddingLeft: `${level * 16}px` }}>
        <div 
          className={`flex items-center gap-1 py-1 px-2 rounded-md hover:bg-secondary/50 cursor-pointer ${selectedFile === node.path ? 'bg-secondary' : ''}`}
          onClick={() => node.type === 'directory' ? toggleDirectory(node.path) : handleFileSelect(node.path)}
        >
          {node.type === 'directory' && (
            node.expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          )}
          {node.type === 'directory' ? (
            <Folder className="h-4 w-4 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        
        {node.type === 'directory' && node.expanded && node.children && (
          <div>{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs defaultValue="editor" className="flex flex-col h-full">
        <div className="border-b border-border">
          <TabsList className="h-10">
            <TabsTrigger value="editor" className="h-9">Editor</TabsTrigger>
            <TabsTrigger value="terminal" className="h-9">Terminal</TabsTrigger>
            <TabsTrigger value="browser" className="h-9">Browser</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="editor" className="flex-1 flex overflow-hidden m-0 p-0">
          <div className="w-64 border-r border-border overflow-y-auto p-2">
            {renderFileTree(fileTree)}
          </div>
          
          <div className="flex-1 overflow-hidden">
            {selectedFile ? (
              <Editor
                height="100%"
                defaultLanguage="typescript"
                defaultValue={fileContent}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  readOnly: false,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a file to view and edit</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="terminal" className="flex-1 m-0 p-0">
          <div className="h-full bg-black text-white p-4 font-mono text-sm overflow-auto">
            <div className="text-green-500">ubuntu@aiden:~$</div>
            <div className="text-white">This is a simulated terminal. In a real implementation, this would be connected to a real terminal session.</div>
          </div>
        </TabsContent>
        
        <TabsContent value="browser" className="flex-1 m-0 p-0">
          <div className="h-full flex items-center justify-center bg-white">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Browser automation preview would appear here</p>
              <Button>Launch Browser</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
