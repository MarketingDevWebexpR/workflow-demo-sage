import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { checkSupabaseConnection } from './lib/supabase'
import workflowsRoutes from './routes/workflows.routes'
import viewsRoutes from './routes/views.routes'
import aiRoutes from './routes/ai.routes'
import messagesRoutes from './routes/messages.routes'
import filesRoutes from './routes/files.routes'
import emailsRoutes from './modules/emails/routes/actions.routes'

const app = new Hono()

const PORT = process.env.PORT || 3002

// Middleware CORS - Permet les requetes depuis le frontend
app.use('*', cors({
  origin: ['http://localhost:3001', 'http://localhost:3003', 'http://localhost:5173'],
  credentials: true,
}))

// Verification de la connexion Supabase au demarrage
async function initSupabase() {
  const isConnected = await checkSupabaseConnection()
  if (isConnected) {
    console.log('Supabase connected successfully')
  } else {
    console.error('Failed to connect to Supabase. Check your environment variables.')
  }
}

initSupabase().catch(err => console.error('Supabase init error:', err))

// Routes
app.get('/', (c) => c.json({
  message: 'API Workflow Automation',
  version: '1.0.0',
  database: 'Supabase',
  endpoints: {
    workflows: '/api/workflows',
    views: '/api/workflows/:workflowId/views',
    ai: '/api/ai',
    files: '/api/files',
    actions: '/api/actions'
  }
}))

app.route('/api/workflows', workflowsRoutes)
app.route('/api/workflows', viewsRoutes)
app.route('/api/workflows', messagesRoutes)
app.route('/api/ai', aiRoutes)
app.route('/api/files', filesRoutes)

// Modules
app.route('/api/actions', emailsRoutes)

// Start server
import { serve } from '@hono/node-server'
serve({ fetch: app.fetch, port: Number(PORT) }, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
