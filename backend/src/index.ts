import { Hono } from 'hono'
import mongoose from 'mongoose'
import workflowsRoutes from './routes/workflows.routes'

const app = new Hono()

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
    workflows: '/api/workflows'
  }
}))

app.route('/api/workflows', workflowsRoutes)

export default app