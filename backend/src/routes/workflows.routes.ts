import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Workflow } from '../models/Workflow.model';

const workflows = new Hono();

// CORS pour permettre les appels depuis le frontend
workflows.use('/*', cors());

// GET /api/workflows - Liste tous les workflows
workflows.get('/', async (c) => {
  try {
    const workflows = await Workflow.find().sort({ createdAt: -1 });
    return c.json({
      success: true,
      data: workflows.map(w => w.toJSON()),
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
      data: workflow.toJSON(),
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
    
    // Validation simple (champs compatibles SharePoint)
    if (!body.Title || !body.WorkflowText) {
      return c.json({
        success: false,
        error: 'Les champs "Title" et "WorkflowText" sont requis',
      }, 400);
    }
    
    const workflow = await Workflow.create(body);

    console.log('ICI workflow', workflow);
    
    return c.json({
      success: true,
      data: (workflow as any).toJSON(),
      message: 'Workflow créé avec succès',
    }, 201);
  } catch (error) {
    console.log('ICI error', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// PUT /api/workflows/:id - Modifier un workflow
workflows.put('/:id', async (c) => {

  console.log('ICI', c);
  console.log('ICI cid', c.req.param('id'));

  try {
    const body = await c.req.json();
    
    // Filtrer les champs undefined pour éviter de les enregistrer
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined)
    );
    
    const workflow = await Workflow.findByIdAndUpdate(
      c.req.param('id'),
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!workflow) {
      return c.json({
        success: false,
        error: 'Workflow non trouvé',
      }, 404);
    }

    console.log('ICI workflow', workflow);
    console.log('ICI updateData', updateData);
    
    return c.json({
      success: true,
      data: workflow.toJSON(),
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

