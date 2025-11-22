import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/fonts/roboto.font-face.module.scss'
import './style/fonts/ubuntu.font-face.module.scss'
import './style/index.css'
import './style/App.module.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
