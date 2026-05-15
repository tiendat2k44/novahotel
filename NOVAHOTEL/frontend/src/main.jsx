import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Entry point: render App bên trong StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
