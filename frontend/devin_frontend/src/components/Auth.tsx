import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Placeholder UI components - in a real app, these would be imported from a UI library like shadcn/ui
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>
    {children}
  </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 p-6">{children}</div>
)

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight">{children}</h3>
)

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
)

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pt-0">{children}</div>
)

const Button = ({ 
  onClick, 
  variant = 'default', 
  className, 
  children,
  type = 'button',
  disabled = false
}: { 
  onClick?: () => void, 
  variant?: 'default' | 'outline', 
  className?: string, 
  children: React.ReactNode,
  type?: 'button' | 'submit',
  disabled?: boolean
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors p-2
      ${variant === 'outline' 
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' 
        : 'bg-primary text-primary-foreground hover:bg-primary/90'} 
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className || ''}`}
  >
    {children}
  </button>
)

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  className
}: {
  type?: string,
  placeholder?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  name?: string,
  className?: string
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    name={name}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
  />
)

const Label = ({ htmlFor, children }: { htmlFor?: string, children: React.ReactNode }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
  >
    {children}
  </label>
)

export function Auth() {
  const { user, signOut } = useAuth()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Use the signIn method from AuthContext
      const { error } = await signIn(email, password)
      
      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Logged In</CardTitle>
          <CardDescription>You are currently logged in as {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Custom auth form for development without actual Supabase
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Button 
              className="w-full justify-center gap-2"
              onClick={() => {}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M17.13 17.13c-1.41 1.41-3.12 2.33-5.13 2.33-4.42 0-8-3.58-8-8s3.58-8 8-8c2.01 0 3.72.92 5.13 2.33"></path>
                <path d="M12 8v4l3 3"></path>
              </svg>
              Sign in with Google
            </Button>
            <Button 
              className="w-full justify-center gap-2"
              onClick={() => {}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              Sign in with Github
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Your Password</Label>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="text-center text-sm">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Forgot your password?
            </a>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Sign up
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
