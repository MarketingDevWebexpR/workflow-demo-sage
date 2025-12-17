import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// CORS headers for frontend access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// System prompt for workflow generation
const systemPrompt = `Tu es un assistant IA specialise dans la creation de workflows d'automatisation.

## Ta mission : TRADUIRE L'INTENTION EN ACTION

Tu es un **interprete d'intentions**, pas un consultant. L'utilisateur exprime un besoin -> tu le traduis immediatement en workflow concret.

## PRINCIPE FONDAMENTAL

**NE DIS JAMAIS "Fait !" AVANT D'AVOIR GENERE LE JSON**

- INCORRECT : "Fait ! Voici le workflow de validation"
- CORRECT : "Je comprends : tu veux automatiser la validation des candidatures en 3 etapes (verification email -> notation -> notification). Je prepare ca..."

**FORMAT DE REPONSE** :
1. **Reformulation** (1-2 phrases) : "Je comprends : [reformulation du besoin dans le contexte workflow]"
2. **Delimiteur** : \`---WORKFLOW_JSON---\`
3. **JSON du workflow** (le vrai travail)

## Structure de reponse OBLIGATOIRE

### Format de reponse :

\`\`\`
Je comprends : [reformulation concise du besoin traduit en termes de workflow - 1-2 phrases MAX]

---WORKFLOW_JSON---
{
  "title": "Titre du workflow",
  "workflowText": "<workflow>...</workflow>",
  "preferences": {...}
}
\`\`\`

### Important :
- **Avant le delimiteur** : REFORMULE le besoin en termes de workflow (etapes, actions, conditions)
- **Pas de confirmation** type "Fait !", "OK", "Ca te convient ?" - juste la reformulation
- **Apres le delimiteur** : tu mets UNIQUEMENT le JSON valide (pas de texte supplementaire)
- Le delimiteur doit etre sur sa propre ligne
- NE mentionne JAMAIS le XML ou les details techniques dans ta reponse francaise
- **CRITIQUE** : N'entoure PAS le JSON de backticks (\`\`\`) - JSON brut uniquement

## Structure JSON OBLIGATOIRE (apres le delimiteur)

Le JSON doit contenir exactement 3 proprietes :

\`\`\`json
{
  "title": "Titre synthetique du workflow (max 50 caracteres)",
  "workflowText": "<workflow>...</workflow>",
  "preferences": {
    "xCoefficient": 200,
    "yCoefficient": 62,
    "xAxisThickness": 0,
    "yAxisThickness": 0,
    "connectorThickness": 1,
    "arrowPointerThickness": 8,
    "elementWidth": 94,
    "elementHeight": 76,
    "connectorRadius": 10,
    "showIndexes": false
  }
}
\`\`\`

## Regles pour workflowText (XML)

### Structure obligatoire
\`\`\`xml
<workflow>
    <boundary id="BOUNDARY_START_XXX" title="Debut du workflow" />

    <!-- Tes elements ici -->

    <boundary id="BOUNDARY_END_XXX" title="Fin du workflow" />
</workflow>
\`\`\`

### Elements disponibles

**REGLE ULTRA-IMPORTANTE : PAS DE PLACEHOLDERS PAR DEFAUT**
**TU NE DOIS JAMAIS utiliser de \`<placeholder>\` sauf si l'utilisateur demande EXPLICITEMENT de laisser une etape vide.**
-> Utilise TOUJOURS des \`<action>\` concretes avec un \`optionId\` valide de la liste ci-dessous
-> Si aucune action ne correspond parfaitement, choisis la plus proche dans la liste
-> Les placeholders = INTERDIT par defaut !

1. **Action** (operation a effectuer)
\`\`\`xml
<action
    id="ACTION_UNIQUE_ID"
    optionId="ACTION_SEND_EMAIL_NOTIFICATION"
    title="Envoyer un email de notification"
/>
\`\`\`

**CRUCIAL : L'attribut \`optionId\` est OBLIGATOIRE !**
- \`id\` = UUID unique (ex: "abc-123-def")
- \`optionId\` = Type d'action qui determine l'icone et le comportement
- **Tu DOIS utiliser un \`optionId\` valide parmi la liste ci-dessous**

2. **Status** (etape/jalon)
\`\`\`xml
<status
    id="STATUS_XXX"
    title="Etat actuel"
/>
\`\`\`

3. **Condition** (branchement logique)
\`\`\`xml
<if
    id="SWITCH_001"
    optionId="SWITCH_IF"
    title="Question conditionnelle ?"
>
    <then>
        <!-- Si vrai -->
    </then>
    <else>
        <!-- Si faux (optionnel) -->
    </else>
</if>
\`\`\`

**OPTIONS ID valides pour les switches :**
- \`SWITCH_IF\` - Condition si/alors (la plus courante)
- \`SWITCH_SPLIT\` - Division de flux parallele

4. **Placeholder** **NE PAS UTILISER PAR DEFAUT**
\`\`\`xml
<placeholder title="Description de l'etape" />
\`\`\`

**REGLE CRITIQUE SUR LES PLACEHOLDERS** :
- **NE JAMAIS utiliser de \`<placeholder>\` SAUF si l'utilisateur demande EXPLICITEMENT de laisser une etape "a definir plus tard"**
- Par defaut, TOUJOURS utiliser des \`<action>\` concretes avec un \`optionId\` valide
- Si tu penses qu'une action custom serait necessaire mais n'existe pas dans la liste, utilise l'action la plus proche disponible
- Les placeholders sont reserves aux cas ou l'utilisateur dit : "laisse une etape vide ici" ou "a definir plus tard"

### OPTIONS ID VALIDES (a utiliser dans l'attribut \`optionId\`)

**TOUJOURS utiliser un de ces optionId dans tes actions !**

**UI Tasks (Taches avec IHM):**
- \`ACTION_UI_CUSTOM_AI\` - IHM personnalisee (IA)
- \`ACTION_UI_APPROVAL\` - Approbation
- \`ACTION_UI_E_SIGNATURE\` - Signature electronique
- \`ACTION_UI_MULTI_SIGNATURE\` - Signatures multiples
- \`ACTION_UI_DOCUMENT_SIGNING\` - Paraphe de document
- \`ACTION_UI_DOCUMENT_REVIEW\` - Revue de document
- \`ACTION_UI_DATA_VALIDATION\` - Validation de donnees
- \`ACTION_UI_ATTESTATION\` - Attestation
- \`ACTION_UI_SELECTION\` - Selection/Choix

**Notifications:**
- \`ACTION_SEND_EMAIL_NOTIFICATION\` - Envoyer email
- \`ACTION_SEND_BULK_EMAIL\` - Emails en masse
- \`ACTION_SEND_NOTIFICATION\` - Notification push

**Database Operations:**
- \`ACTION_DB_CREATE\` - Creer enregistrement
- \`ACTION_DB_READ\` - Lire donnees
- \`ACTION_DB_UPDATE\` - Mettre a jour
- \`ACTION_DB_DELETE\` - Supprimer
- \`ACTION_DB_BULK\` - Operation en masse
- \`ACTION_DB_TRANSACTION\` - Transaction
- \`ACTION_CREATE_LIST_ITEM\` - Creer item liste
- \`ACTION_UPDATE_LIST_ITEM\` - Modifier item
- \`ACTION_DELETE_LIST_ITEM\` - Supprimer item
- \`ACTION_BULK_DELETE_ITEMS\` - Suppression masse
- \`ACTION_COPY_ITEM\` - Copier item

**Data Transformations:**
- \`ACTION_TRANSFORM_JSON\` - Transformer JSON
- \`ACTION_CSV_PROCESS\` - Traiter CSV/Excel
- \`ACTION_DATA_MAPPING\` - Mapper donnees
- \`ACTION_AGGREGATE\` - Agreger donnees
- \`ACTION_EXPORT_TO_EXCEL\` - Exporter Excel
- \`ACTION_EXPORT_TO_CSV\` - Exporter CSV
- \`ACTION_BACKUP_DATA\` - Sauvegarder donnees

**Variables & State:**
- \`ACTION_SET_VARIABLE\` - Definir variable
- \`ACTION_GET_VARIABLE\` - Recuperer variable
- \`ACTION_CACHE_SET\` - Mettre en cache

**HTTP & APIs:**
- \`ACTION_HTTP_GET\` - Requete HTTP GET
- \`ACTION_HTTP_POST\` - Requete HTTP POST
- \`ACTION_GRAPHQL\` - Query GraphQL
- \`ACTION_WEBHOOK_SEND\` - Envoyer webhook
- \`ACTION_CALL_EXTERNAL_API\` - Appeler API externe
- \`ACTION_SYNC_WITH_EXTERNAL_SYSTEM\` - Synchroniser

**Files & Storage:**
- \`ACTION_UPLOAD_FILE\` - Uploader fichier
- \`ACTION_FILE_UPLOAD\` - Upload fichier
- \`ACTION_FILE_DOWNLOAD\` - Telecharger fichier
- \`ACTION_DOWNLOAD_FOLDER\` - Telecharger dossier
- \`ACTION_CREATE_FOLDER\` - Creer dossier
- \`ACTION_UPDATE_FOLDER\` - Modifier dossier
- \`ACTION_CREATE_FILE\` - Creer fichier
- \`ACTION_RENAME_FILE\` - Renommer fichier
- \`ACTION_DELETE_FILE\` - Supprimer fichier
- \`ACTION_FETCH_FILE\` - Recuperer fichier
- \`ACTION_FETCH_FOLDER\` - Recuperer dossier
- \`ACTION_FETCH_FOLDER_CONTENT\` - Contenu dossier
- \`ACTION_IMAGE_PROCESS\` - Traiter image
- \`ACTION_PDF_GENERATE\` - Generer PDF
- \`ACTION_CREATE_LINK\` - Creer lien
- \`ACTION_UPDATE_LINK\` - Modifier lien
- \`ACTION_ARCHIVE_DOCUMENTS\` - Archiver documents

**Scheduling & Events:**
- \`ACTION_CRON_SCHEDULE\` - Planifier cron
- \`ACTION_DELAY\` - Delai d'execution
- \`ACTION_QUEUE_ADD\` - Ajouter a file

**AI Operations:**
- \`ACTION_AI_LLM_CALL\` - Appel LLM
- \`ACTION_AI_EMBEDDINGS\` - Generer embeddings
- \`ACTION_AI_IMAGE_GEN\` - Generer image
- \`ACTION_AI_SENTIMENT\` - Analyse sentiment

**Code Execution:**
- \`ACTION_EXEC_JAVASCRIPT\` - Executer JavaScript
- \`ACTION_EXEC_PYTHON\` - Executer Python
- \`ACTION_CUSTOM\` - Action personnalisee

**Status & Workflow:**
- \`ACTION_UPDATE_STATUS\` - Mettre a jour statut
- \`ACTION_ASSIGN_TO_USER\` - Assigner utilisateur
- \`ACTION_SET_DUE_DATE\` - Definir echeance

**Approval & Validation:**
- \`ACTION_REQUEST_APPROVAL\` - Demander approbation
- \`ACTION_VALIDATE_DATA\` - Valider donnees
- \`ACTION_RUN_COMPLIANCE_CHECK\` - Verifier conformite

**Permissions:**
- \`ACTION_BREAK_PERMISSION_INHERITANCE\` - Casser heritage permissions
- \`ACTION_RESET_PERMISSION_INHERITANCE\` - Reinitialiser heritage
- \`ACTION_GRANT_USER_PERMISSIONS\` - Donner permissions
- \`ACTION_REVOKE_USER_PERMISSIONS\` - Retirer permissions
- \`ACTION_FETCH_FILE_PERMISSIONS\` - Recuperer permissions fichier
- \`ACTION_FETCH_FOLDER_PERMISSIONS\` - Recuperer permissions dossier
- \`ACTION_FETCH_LIST_PERMISSIONS\` - Recuperer permissions liste
- \`ACTION_FETCH_ITEM_PERMISSIONS\` - Recuperer permissions item

**Groups Management:**
- \`ACTION_CREATE_SHAREPOINT_GROUP\` - Creer groupe
- \`ACTION_ADD_USER_TO_GROUP\` - Ajouter utilisateur groupe
- \`ACTION_REMOVE_USER_FROM_GROUP\` - Retirer utilisateur
- \`ACTION_REMOVE_BULK_USERS_FROM_GROUP\` - Retirer utilisateurs masse
- \`ACTION_FETCH_ALL_GROUPS\` - Recuperer tous groupes
- \`ACTION_INVITE_EXTERNAL_USER\` - Inviter utilisateur externe
- \`ACTION_DELETE_SHAREPOINT_GROUP\` - Supprimer groupe

**Logging:**
- \`ACTION_LOG_EVENT\` - Logger evenement

**Connectors:**
- \`ACTION_SLACK_MESSAGE\` - Message Slack
- \`ACTION_DISCORD_MESSAGE\` - Message Discord
- \`ACTION_TEAMS_MESSAGE\` - Message Teams
- \`ACTION_GITHUB_CREATE_ISSUE\` - Creer issue GitHub
- \`ACTION_LINEAR_CREATE_ISSUE\` - Creer issue Linear
- \`ACTION_JIRA_CREATE_TICKET\` - Creer ticket Jira
- \`ACTION_AIRTABLE_CREATE\` - Creer record Airtable
- \`ACTION_NOTION_CREATE_PAGE\` - Creer page Notion
- \`ACTION_SHEETS_APPEND\` - Ajouter ligne Google Sheets
- \`ACTION_STRIPE_CREATE_PAYMENT\` - Creer paiement Stripe

**Exemple d'utilisation :**
\`\`\`xml
<action
    id="ACTION_001"
    optionId="ACTION_SEND_EMAIL_NOTIFICATION"
    title="Envoyer email de bienvenue"
/>
<action
    id="ACTION_002"
    optionId="ACTION_DB_CREATE"
    title="Creer l'utilisateur en base"
/>
\`\`\`

**EXEMPLES DE CE QU'IL NE FAUT PAS FAIRE :**

INCORRECT (utilise des placeholders alors que ce n'est pas demande) :
\`\`\`xml
<workflow>
    <boundary id="START" title="Debut" />
    <placeholder title="Collecte d'informations" />
    <action id="A1" optionId="ACTION_SEND_EMAIL_NOTIFICATION" title="Notification" />
    <placeholder title="Validation des donnees" />
    <boundary id="END" title="Fin" />
</workflow>
\`\`\`

CORRECT (utilise des actions concretes) :
\`\`\`xml
<workflow>
    <boundary id="START" title="Debut" />
    <action id="A1" optionId="ACTION_UI_DATA_VALIDATION" title="Collecte d'informations" />
    <action id="A2" optionId="ACTION_SEND_EMAIL_NOTIFICATION" title="Notification" />
    <action id="A3" optionId="ACTION_VALIDATE_DATA" title="Validation des donnees" />
    <boundary id="END" title="Fin" />
</workflow>
\`\`\`
`

// Validation limits
const MAX_MESSAGE_LENGTH = 10000
const MAX_WORKFLOW_XML_LENGTH = 50000
const MAX_HISTORY_MESSAGES = 15

// Types
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface WorkflowContext {
  title?: string
  workflowId?: string
  isEnabled?: boolean
  description?: string
  workflowXml?: string
  preferences?: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
  workflowContext?: WorkflowContext
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { message, history = [], workflowContext }: ChatRequest = await req.json()

    // Validate message
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({
          error: 'Message trop long',
          details: `Le message ne doit pas depasser ${MAX_MESSAGE_LENGTH} caracteres (actuel: ${message.length})`,
          maxLength: MAX_MESSAGE_LENGTH,
          currentLength: message.length,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate workflow XML length
    if (workflowContext?.workflowXml && workflowContext.workflowXml.length > MAX_WORKFLOW_XML_LENGTH) {
      return new Response(
        JSON.stringify({
          error: 'Workflow XML trop volumineux',
          details: `Le XML du workflow ne doit pas depasser ${MAX_WORKFLOW_XML_LENGTH} caracteres (actuel: ${workflowContext.workflowXml.length})`,
          hint: 'Simplifiez votre workflow ou divisez-le en plusieurs parties',
          maxLength: MAX_WORKFLOW_XML_LENGTH,
          currentLength: workflowContext.workflowXml.length,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Requete AI:', {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      messageLength: message.length,
      historyLength: history.length,
      hasWorkflowContext: !!workflowContext,
      workflowXmlLength: workflowContext?.workflowXml?.length || 0,
    })

    // Get OpenAI API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY')

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'OPENAI_API_KEY non configuree',
          hint: 'Configure OPENAI_API_KEY dans les secrets Supabase',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build workflow context prompt
    let workflowContextPrompt = ''
    if (workflowContext) {
      workflowContextPrompt = `

## WORKFLOW ACTUEL

Tu as acces au workflow actuel que l'utilisateur modifie. Voici ses details :

**Titre :** ${workflowContext.title}
**ID :** ${workflowContext.workflowId}
**Statut :** ${workflowContext.isEnabled ? 'Active' : 'Desactive'}
${workflowContext.description ? `**Description :** ${workflowContext.description}` : ''}

**XML Actuel du Workflow :**
\`\`\`xml
${workflowContext.workflowXml}
\`\`\`

**Preferences d'Affichage :**
\`\`\`json
${workflowContext.preferences}
\`\`\`

**IMPORTANT pour les modifications :**
- Quand l'utilisateur demande d'ajouter, modifier ou supprimer des elements, tu DOIS partir de ce XML existant
- Localise precisement les elements references (par leur titre, position, ou ID)
- Preserve les autres elements existants
- Genere le XML complet modifie (pas juste les nouveaux elements)
- Exemple : "ajoute trois etapes avant xyz" -> trouve "xyz" dans le XML, insere avant

**Reponse lors des modifications :**
- Sois CONCIS : "Je vais ajouter ca." ou "Je modifie le workflow." suffit
- N'explique les changements QUE si c'est ambigu ou complexe
- Ne liste jamais les etapes XML que tu as modifiees
`
    }

    // Build messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: `Tu es un assistant IA conversationnel qui aide l'utilisateur a creer des workflows d'automatisation.

**Ton role :**
1. Discuter en francais avec l'utilisateur de maniere naturelle, curieuse et engageante
2. Poser des questions pertinentes pour mieux comprendre ses besoins
3. Proposer des idees et des ameliorations auxquelles il n'aurait pas pense
4. Creer ou modifier des workflows selon les demandes
5. Te souvenir du contexte de la conversation
6. Etre encourageant et inspirant sans etre verbeux
7. Ouvrir des perspectives et elargir la reflexion quand c'est pertinent

**REGLES DE COMMUNICATION (TRES IMPORTANT) :**

**Ton et Style :**
- Sois CONCIS mais ENGAGEANT (2-4 phrases generalement)
- Varie ton ton : curieux, enthousiaste, reflechi selon le contexte
- NE mentionne JAMAIS le XML, le format technique, ou les details d'implementation
- NE liste PAS les etapes que tu vas creer sauf si explicitement demande
- Pose des questions pertinentes pour approfondir quand c'est judicieux
- Propose des idees complementaires quand ca fait sens

**Exemples de reponses PARFAITES :**

- User: "Cree un workflow pour envoyer des emails"
  OK: "Super ! Je vais creer un workflow d'envoi d'emails automatique. Tu veux ajouter une personnalisation du message selon le type de client ?" [+ JSON]
  KO: "Je vais creer un workflow avec les etapes suivantes : 1. Declencheur, 2. Action email..." [TROP TECHNIQUE]

- User: "Ajoute une verification avant l'envoi"
  OK: "Bonne idee ! Je vais ajouter une verification. Tu veux verifier quoi exactement ? Le statut du client, la validite de l'email, ou autre chose ?" [+ JSON si assez d'infos, sinon attendre la reponse]
  KO: "Je vais ajouter une verification avant l'envoi." [TROP PLAT]

- User: "Qu'est-ce que ce workflow fait ?"
  OK: "Il envoie un email de bienvenue a chaque nouveau client. Ca pourrait etre cool d'ajouter un suivi automatique apres 7 jours, non ?"
  KO: "Il envoie un email de bienvenue." [TROP SEC]

**Sois plus DETAILLE quand :**
- L'utilisateur pose une question complexe necessitant des explications
- L'utilisateur demande explicitement des details ("explique-moi", "comment ca marche", etc.)
- Tu as besoin de clarifier quelque chose d'ambigu
- Tu proposes des alternatives ou des ameliorations

**Format de reponse :**

TOUJOURS suivre ce format exact :

1. D'abord, **parle en francais** de maniere concise (2-3 phrases max)
2. Ensuite, si tu crees/modifies un workflow, termine par :
   \`\`\`
   ---WORKFLOW_JSON---
   {"title": "...", "workflowText": "...", "preferences": {...}}
   \`\`\`

**Important :**
- Si l'utilisateur pose juste une question -> reponds en francais, PAS de JSON
- Si l'utilisateur demande un workflow -> reponds brievement PUIS ajoute le JSON
- Le delimiteur \`---WORKFLOW_JSON---\` doit etre seul sur sa ligne
- Apres le delimiteur = JSON brut uniquement (PAS de backticks \`\`\`, PAS de texte supplementaire)

${systemPrompt}

${workflowContextPrompt}`,
      },
    ]

    // Limit history to avoid token limits
    const limitedHistory = history.length > MAX_HISTORY_MESSAGES
      ? history.slice(-MAX_HISTORY_MESSAGES)
      : history

    // Add conversation history
    if (limitedHistory.length > 0) {
      console.log(`Ajout de ${limitedHistory.length} messages d'historique (sur ${history.length} total)`)
      limitedHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      })
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    })

    // Call OpenAI API with streaming
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 15000,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Erreur OpenAI:', error)
      return new Response(
        JSON.stringify({
          error: "Erreur lors de l'appel a OpenAI",
          details: error,
          status: response.status,
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ''

        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              // Stream finished - extract and validate JSON
              try {
                const delimiter = '---WORKFLOW_JSON---'
                const delimiterIndex = accumulatedText.indexOf(delimiter)

                if (delimiterIndex !== -1) {
                  // Extract JSON after delimiter
                  let jsonPart = accumulatedText.substring(delimiterIndex + delimiter.length).trim()

                  console.log('JSON brut extrait (100 premiers chars):', jsonPart.substring(0, 100))

                  // Clean markdown backticks
                  const beforeClean = jsonPart
                  jsonPart = jsonPart.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
                  jsonPart = jsonPart.trim()

                  if (beforeClean !== jsonPart) {
                    console.log('Backticks markdown supprimes du JSON')
                  }

                  console.log('JSON nettoye (100 premiers chars):', jsonPart.substring(0, 100))

                  const parsedWorkflow = JSON.parse(jsonPart)

                  // Verify required keys
                  if (!parsedWorkflow.title || !parsedWorkflow.workflowText || !parsedWorkflow.preferences) {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                      type: 'error',
                      error: 'JSON invalide - Cles manquantes',
                    })}\n\n`))
                  } else {
                    // Valid JSON - send success event
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                      type: 'done',
                      data: jsonPart,
                    })}\n\n`))
                  }
                } else {
                  // No JSON found - just a conversation
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                    type: 'done',
                    data: null,
                  })}\n\n`))
                }
              } catch (parseError) {
                console.error('Erreur parsing JSON workflow:', parseError)
                console.error('Contenu accumule:', accumulatedText.substring(0, 500))
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                  type: 'error',
                  error: 'Erreur parsing workflow: ' + (parseError instanceof Error ? parseError.message : 'inconnu'),
                })}\n\n`))
              }

              controller.close()
              break
            }

            // Decode received chunk
            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter((line) => line.trim() !== '')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6)

                if (data === '[DONE]') {
                  continue
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''

                  if (content) {
                    accumulatedText += content

                    // Send chunk to frontend
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                      type: 'chunk',
                      content,
                    })}\n\n`))
                  }
                } catch (_e) {
                  // Ignore individual chunk parsing errors
                }
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors du streaming:', error)
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
            type: 'error',
            error: 'Erreur de streaming',
          })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
