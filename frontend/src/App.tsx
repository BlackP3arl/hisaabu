import { ConfigProvider } from 'antd'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './App.css'

// Create a client for React Query
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <Router>
          <Routes>
            {/* Placeholder routes */}
            <Route path="/" element={<div className="container"><h1>Hisaabu - Welcome</h1><p>Select a role to login</p></div>} />
            <Route path="/admin" element={<div className="container"><h1>Platform Admin Dashboard</h1><p>Coming soon...</p></div>} />
            <Route path="/tenant" element={<div className="container"><h1>Tenant Dashboard</h1><p>Coming soon...</p></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
