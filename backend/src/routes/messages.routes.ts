import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { supabase } from '../lib/supabase'
import { toMessageApi, type MessageInsert, type MessageUpdate } from '../types/database.types'

const messages = new Hono()

// CORS pour permettre les appels depuis le frontend
messages.use('/*', cors())

// GET /api/workflows/:workflowId/messages - Recuperer tous les messages d'un workflow
messages.get('/:workflowId/messages', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: true }) // Tri chronologique (du plus ancien au plus recent)

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: data.map(toMessageApi),
      count: data.length,
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// POST /api/workflows/:workflowId/messages - Creer un nouveau message
messages.post('/:workflowId/messages', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')
    const body = await c.req.json()

    // Validation simple
    if (!body.Role || body.Content === undefined || body.Content === null) {
      return c.json({
        success: false,
        error: 'Les champs "Role" et "Content" sont requis',
      }, 400)
    }

    // Creer le message avec le workflow_id
    const insertData: MessageInsert = {
      workflow_id: workflowId,
      role: body.Role,
      content: body.Content,
      status: body.Status ?? 'completed',
      workflow_data: body.WorkflowData ?? null,
      error_message: body.ErrorMessage ?? null,
      tokens_used: body.TokensUsed ?? null,
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: toMessageApi(data),
      message: 'Message cree avec succes',
    }, 201)
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// PUT /api/workflows/:workflowId/messages/:id - Modifier un message
messages.put('/:workflowId/messages/:id', async (c) => {
  try {
    const messageId = c.req.param('id')
    const body = await c.req.json()

    // Transformer les champs du format API vers le format Supabase
    const updateData: MessageUpdate = {}

    if (body.Role !== undefined) updateData.role = body.Role
    if (body.Content !== undefined) updateData.content = body.Content
    if (body.Status !== undefined) updateData.status = body.Status
    if (body.WorkflowData !== undefined) updateData.workflow_data = body.WorkflowData
    if (body.ErrorMessage !== undefined) updateData.error_message = body.ErrorMessage
    if (body.TokensUsed !== undefined) updateData.tokens_used = body.TokensUsed

    // Mettre a jour updated_at
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('messages')
      .update(updateData)
      .eq('id', messageId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({
          success: false,
          error: 'Message non trouve',
        }, 404)
      }
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: toMessageApi(data),
      message: 'Message modifie avec succes',
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// DELETE /api/workflows/:workflowId/messages - Supprimer tous les messages d'un workflow
messages.delete('/:workflowId/messages', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')

    // Compter d'abord combien de messages existent
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('workflow_id', workflowId)

    if (countError) {
      return c.json({
        success: false,
        error: countError.message,
      }, 500)
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('workflow_id', workflowId)

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      message: `${count ?? 0} message(s) supprime(s) avec succes`,
      deletedCount: count ?? 0,
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// DELETE /api/workflows/:workflowId/messages/:id - Supprimer un message specifique
messages.delete('/:workflowId/messages/:id', async (c) => {
  try {
    const messageId = c.req.param('id')

    // Verifier d'abord que le message existe
    const { data: existing, error: findError } = await supabase
      .from('messages')
      .select('id')
      .eq('id', messageId)
      .single()

    if (findError || !existing) {
      return c.json({
        success: false,
        error: 'Message non trouve',
      }, 404)
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      message: 'Message supprime avec succes',
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

export default messages
