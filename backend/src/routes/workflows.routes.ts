import { Hono } from 'hono';
import { Workflow } from '../models/Workflow.model';

const workflows = new Hono();

// GET /api/workflows - Liste tous les workflows
workflows.get('/', async (c) => {
  try {
    const workflows = await Workflow.find().sort({ createdAt: -1 });
    return c.json({
      success: true,
      data: workflows,
      count: workflows.length,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// GET /api/workflows/:id - Récupérer un workflow par ID
workflows.get('/:id', async (c) => {
  try {
    const workflow = await Workflow.findById(c.req.param('id'));
    
    if (!workflow) {
      return c.json({
        success: false,
        error: 'Workflow non trouvé',
      }, 404);
    }
    
    return c.json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// POST /api/workflows - Créer un nouveau workflow
workflows.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validation simple
    if (!body.title || !body.workflowXML) {
      return c.json({
        success: false,
        error: 'Les champs "title" et "workflowXML" sont requis',
      }, 400);
    }
    
    const workflow = await Workflow.create(body);
    
    return c.json({
      success: true,
      data: workflow,
      message: 'Workflow créé avec succès',
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// PUT /api/workflows/:id - Modifier un workflow
workflows.put('/:id', async (c) => {
  try {
    const body = await c.req.json();
    
    const workflow = await Workflow.findByIdAndUpdate(
      c.req.param('id'),
      body,
      { new: true, runValidators: true }
    );
    
    if (!workflow) {
      return c.json({
        success: false,
        error: 'Workflow non trouvé',
      }, 404);
    }
    
    return c.json({
      success: true,
      data: workflow,
      message: 'Workflow modifié avec succès',
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// DELETE /api/workflows/:id - Supprimer un workflow
workflows.delete('/:id', async (c) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(c.req.param('id'));
    
    if (!workflow) {
      return c.json({
        success: false,
        error: 'Workflow non trouvé',
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Workflow supprimé avec succès',
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

export default workflows;

