import { Hono } from 'hono'
import { cors } from 'hono/cors'
import mongoose from 'mongoose'
import workflowsRoutes from './routes/workflows.routes'
import viewsRoutes from './routes/views.routes'
import aiRoutes from './routes/ai.routes'
import messagesRoutes from './routes/messages.routes'
import filesRoutes from './routes/files.routes'
import emailsRoutes from './modules/emails/routes/actions.routes'

const app = new Hono()

// Middleware CORS - Permet les requêtes depuis le frontend
app.use('*', cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'], // Ports du frontend
  credentials: true,
}))

// Connexion MongoDB
main().catch(err => console.log('❌ Erreur MongoDB:', err));

async function main() {
  await mongoose.connect('mongodb://root:root@localhost:27017/automation_poc?authSource=admin');
  console.log('✅ MongoDB connecté (état:', mongoose.connection.readyState, ')');
}

// Routes
app.get('/', (c) => c.json({ 
  message: 'API Workflow Automation', 
  version: '1.0.0',
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

export default app