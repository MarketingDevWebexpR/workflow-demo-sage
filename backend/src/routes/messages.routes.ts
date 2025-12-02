import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Message } from '../models/Message.model';

const messages = new Hono();

// CORS pour permettre les appels depuis le frontend
messages.use('/*', cors());

// GET /api/workflows/:workflowId/messages - Récupérer tous les messages d'un workflow
messages.get('/:workflowId/messages', async (c) => {
  try {
    const workflowId = c.req.param('workflowId');
    
    const messages = await Message.find({ WorkflowId: workflowId })
      .sort({ createdAt: 1 }); // Tri chronologique (du plus ancien au plus récent)
    
    return c.json({
      success: true,
      data: messages.map(m => m.toJSON()),
      count: messages.length,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// POST /api/workflows/:workflowId/messages - Créer un nouveau message
messages.post('/:workflowId/messages', async (c) => {
  try {
    const workflowId = c.req.param('workflowId');
    const body = await c.req.json();
    
    // Validation simple
    if (!body.Role || body.Content === undefined || body.Content === null) {
      return c.json({
        success: false,
        error: 'Les champs "Role" et "Content" sont requis',
      }, 400);
    }
    
    // Créer le message avec le WorkflowId
    const message = await Message.create({
      ...body,
      WorkflowId: workflowId,
    });
    
    return c.json({
      success: true,
      data: message.toJSON(),
      message: 'Message créé avec succès',
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// PUT /api/workflows/:workflowId/messages/:id - Modifier un message
messages.put('/:workflowId/messages/:id', async (c) => {
  try {
    const messageId = c.req.param('id');
    const body = await c.req.json();
    
    // Filtrer les champs undefined
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined)
    );
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return c.json({
        success: false,
        error: 'Message non trouvé',
      }, 404);
    }
    
    return c.json({
      success: true,
      data: message.toJSON(),
      message: 'Message modifié avec succès',
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// DELETE /api/workflows/:workflowId/messages - Supprimer tous les messages d'un workflow
messages.delete('/:workflowId/messages', async (c) => {
  try {
    const workflowId = c.req.param('workflowId');
    
    const result = await Message.deleteMany({ WorkflowId: workflowId });
    
    return c.json({
      success: true,
      message: `${result.deletedCount} message(s) supprimé(s) avec succès`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

// DELETE /api/workflows/:workflowId/messages/:id - Supprimer un message spécifique
messages.delete('/:workflowId/messages/:id', async (c) => {
  try {
    const messageId = c.req.param('id');
    
    const message = await Message.findByIdAndDelete(messageId);
    
    if (!message) {
      return c.json({
        success: false,
        error: 'Message non trouvé',
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Message supprimé avec succès',
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500);
  }
});

export default messages;

