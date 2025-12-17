import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { supabase } from '../lib/supabase'
import { toViewApi, type ViewInsert, type ViewUpdate } from '../types/database.types'

const views = new Hono()

// CORS pour permettre les appels depuis le frontend
views.use('/*', cors())

// GET /api/workflows/:workflowId/views - Recuperer toutes les vues d'un workflow
views.get('/:workflowId/views', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')

    const { data, error } = await supabase
      .from('views')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('step_id', { ascending: true })

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: data.map(toViewApi),
      count: data.length,
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// GET /api/workflows/:workflowId/views/:stepId - Recuperer l'IHM d'une etape specifique
views.get('/:workflowId/views/:stepId', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')
    const stepId = c.req.param('stepId')

    const { data, error } = await supabase
      .from('views')
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('step_id', stepId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // La vue n'existe pas encore - retourner success: true mais sans Id
        // Le frontend detectera l'absence de Id et creera automatiquement la vue
        return c.json({
          success: true,
          exists: false,
          data: {
            workflowId,
            stepId,
            components: '[]',
          },
        })
      }
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      exists: true,
      data: toViewApi(data),
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// PUT /api/workflows/:workflowId/views/:stepId - Creer ou mettre a jour l'IHM d'une etape
views.put('/:workflowId/views/:stepId', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')
    const stepId = c.req.param('stepId')
    const body = await c.req.json()

    if (!body.components) {
      return c.json({
        success: false,
        error: 'Le champ "components" est requis',
      }, 400)
    }

    // Verifier si la vue existe deja
    const { data: existing } = await supabase
      .from('views')
      .select('id')
      .eq('workflow_id', workflowId)
      .eq('step_id', stepId)
      .single()

    let data
    let error

    if (existing) {
      // Mettre a jour la vue existante
      const updateData: ViewUpdate = {
        components: body.components,
        updated_at: new Date().toISOString(),
      }

      const result = await supabase
        .from('views')
        .update(updateData)
        .eq('workflow_id', workflowId)
        .eq('step_id', stepId)
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      // Creer une nouvelle vue
      const insertData: ViewInsert = {
        workflow_id: workflowId,
        step_id: stepId,
        components: body.components,
      }

      const result = await supabase
        .from('views')
        .insert(insertData)
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      data: toViewApi(data),
      message: 'Vue sauvegardee avec succes',
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// DELETE /api/workflows/:workflowId/views/:stepId - Supprimer l'IHM d'une etape
views.delete('/:workflowId/views/:stepId', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')
    const stepId = c.req.param('stepId')

    // Verifier d'abord que la vue existe
    const { data: existing, error: findError } = await supabase
      .from('views')
      .select('id')
      .eq('workflow_id', workflowId)
      .eq('step_id', stepId)
      .single()

    if (findError || !existing) {
      return c.json({
        success: false,
        error: 'Vue non trouvee',
      }, 404)
    }

    const { error } = await supabase
      .from('views')
      .delete()
      .eq('workflow_id', workflowId)
      .eq('step_id', stepId)

    if (error) {
      return c.json({
        success: false,
        error: error.message,
      }, 500)
    }

    return c.json({
      success: true,
      message: 'Vue supprimee avec succes',
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

// DELETE /api/workflows/:workflowId/views - Supprimer TOUTES les vues d'un workflow
views.delete('/:workflowId/views', async (c) => {
  try {
    const workflowId = c.req.param('workflowId')

    // Compter d'abord combien de vues existent
    const { count, error: countError } = await supabase
      .from('views')
      .select('*', { count: 'exact', head: true })
      .eq('workflow_id', workflowId)

    if (countError) {
      return c.json({
        success: false,
        error: countError.message,
      }, 500)
    }

    const { error } = await supabase
      .from('views')
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
      message: `${count ?? 0} vue(s) supprimee(s) avec succes`,
      deletedCount: count ?? 0,
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }, 500)
  }
})

export default views
