import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { supabase } from '../lib/supabase'
import { toWorkflowApi, type WorkflowInsert, type WorkflowUpdate } from '../types/database.types'

const workflows = new Hono()

// CORS pour permettre les appels depuis le frontend
workflows.use('/*', cors())

// GET /api/workflows - Liste tous les workflows
workflows.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: data.map(toWorkflowApi),
      count: data.length,
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// GET /api/workflows/:id - Recuperer un workflow par ID
workflows.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({
          success: false,
          error: 'Workflow non trouve',
        }, 404)
      }
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: toWorkflowApi(data),
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// POST /api/workflows - Creer un nouveau workflow
workflows.post('/', async (c) => {
  try {
    const body = await c.req.json()

    // Validation simple (champs compatibles SharePoint)
    if (!body.Title || !body.WorkflowText) {
      return c.json({
        success: false,
        error: 'Les champs "Title" et "WorkflowText" sont requis',
      }, 400)
    }

    // Transformer les champs du format API vers le format Supabase
    const insertData: WorkflowInsert = {
      title: body.Title,
      description: body.Description ?? null,
      fragment_id: body.FragmentId ?? 'DEFAULT',
      is_enabled: body.IsEnabled ?? 0,
      workflow_text: body.WorkflowText,
      preferences: body.Preferences ?? JSON.stringify({
        xCoefficient: 200,
        yCoefficient: 30,
        xAxisThickness: 2,
        yAxisThickness: 2,
        elementWidth: 12,
        elementHeight: 12,
        connectorThickness: 2,
        connectorRadius: 15,
        arrowPointerThickness: 8,
        showIndexes: true,
      }),
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.log('Supabase insert error:', error)
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    console.log('Workflow created:', data)

    return c.json({
      success: true,
      data: toWorkflowApi(data),
      message: 'Workflow cree avec succes',
    }, 201)
  } catch (error) {
    console.log('Error creating workflow:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// PUT /api/workflows/:id - Modifier un workflow
workflows.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    console.log('Updating workflow:', id)
    console.log('Update body:', body)

    // Transformer les champs du format API vers le format Supabase
    const updateData: WorkflowUpdate = {}

    if (body.Title !== undefined) updateData.title = body.Title
    if (body.Description !== undefined) updateData.description = body.Description
    if (body.FragmentId !== undefined) updateData.fragment_id = body.FragmentId
    if (body.IsEnabled !== undefined) updateData.is_enabled = body.IsEnabled
    if (body.WorkflowText !== undefined) updateData.workflow_text = body.WorkflowText
    if (body.Preferences !== undefined) updateData.preferences = body.Preferences

    // Mettre a jour updated_at
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('workflows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({
          success: false,
          error: 'Workflow non trouve',
        }, 404)
      }
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    console.log('Workflow updated:', data)

    return c.json({
      success: true,
      data: toWorkflowApi(data),
      message: 'Workflow modifie avec succes',
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// DELETE /api/workflows/:id - Supprimer un workflow
workflows.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // Verifier d'abord que le workflow existe
    const { data: existing, error: findError } = await supabase
      .from('workflows')
      .select('id')
      .eq('id', id)
      .single()

    if (findError || !existing) {
      return c.json({
        success: false,
        error: 'Workflow non trouve',
      }, 404)
    }

    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      message: 'Workflow supprime avec succes',
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

export default workflows
