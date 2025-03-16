import { ThemeProvider } from './components/ui/theme-provider'
import { SplitPaneLayout } from './components/SplitPaneLayout'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="aiden-theme">
      <AuthProvider>
        <SplitPaneLayout />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
