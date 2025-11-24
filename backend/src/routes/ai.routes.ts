import { Hono } from 'hono';
import { cors } from 'hono/cors';

const ai = new Hono();

// CORS pour permettre les appels depuis le frontend
ai.use('/*', cors());

// Route pour générer un workflow avec l'IA en streaming (SSE)
ai.post('/chat', async (c) => {
    try {
        const { message } = await c.req.json();

        if (!message) {
            return c.json({ error: 'Message requis' }, 400);
        }

        // Récupérer la clé API depuis les variables d'environnement
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return c.json({
                error: 'OPENAI_API_KEY non configurée',
                hint: 'Ajoute OPENAI_API_KEY=sk-... dans ton .env'
            }, 500);
        }

        // ========================================
        // ✅ SYSTEM PROMPT ACTUEL
        // ========================================
        const systemPrompt = `Tu es un assistant IA spécialisé dans la création de workflows d'automatisation.

## Ta mission
Convertir les descriptions en langage naturel en workflows XML formatés, avec des préférences d'affichage et un titre synthétique.

## Structure de réponse OBLIGATOIRE

Tu DOIS répondre UNIQUEMENT avec un objet JSON valide contenant exactement 3 propriétés :

\`\`\`json
{
  "title": "Titre synthétique du workflow (max 50 caractères)",
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

## Règles pour workflowText (XML)

### Structure obligatoire
\`\`\`xml
<workflow>
    <boundary id="BOUNDARY_START_XXX" title="Début du workflow" />
    
    <!-- Tes éléments ici -->
    
    <boundary id="BOUNDARY_END_XXX" title="Fin du workflow" />
</workflow>
\`\`\`

### Éléments disponibles

1. **Action** (opération à effectuer)
\`\`\`xml
<action
    id="ACTION_XXX"
    type="nomAction"
    title="Description claire"
/>
\`\`\`

2. **Status** (étape/jalon)
\`\`\`xml
<status
    id="STATUS_XXX"
    title="État actuel"
/>
\`\`\`

3. **Condition** (branchement logique)
\`\`\`xml
<if id="SWITCH_XXX" title="Question conditionnelle ?">
    <then>
        <!-- Si vrai -->
    </then>
    <else>
        <!-- Si faux (optionnel) -->
    </else>
</if>
\`\`\`

4. **Placeholder** (étape à définir)
\`\`\`xml
<placeholder title="Description de l'étape" />
\`\`\`

### Actions disponibles par catégorie

**Control Flow:**
- \`conditionalBranch\` - Branchement conditionnel
- \`parallelExecution\` - Exécution parallèle
- \`loopIteration\` - Boucle d'itération
- \`trycatch\` - Gestion d'erreurs

**UI Tasks:**
- \`displayForm\` - Afficher formulaire
- \`multiStepForm\` - Formulaire multi-étapes

**Database:**
- \`dbCreate\` - Créer enregistrement
- \`dbRead\` - Lire données
- \`dbUpdate\` - Mettre à jour
- \`dbDelete\` - Supprimer
- \`dbQuery\` - Requête SQL personnalisée
- \`dbTransaction\` - Transaction

**Data Transformations:**
- \`jsonTransform\` - Transformer JSON
- \`csvProcess\` - Traiter CSV
- \`dataMap\` - Mapper données
- \`aggregateData\` - Agréger données

**Variables & State:**
- \`setVariable\` - Définir variable
- \`getVariable\` - Récupérer variable
- \`cacheSet\` - Mettre en cache
- \`cacheGet\` - Lire cache

**HTTP & APIs:**
- \`httpRequest\` - Requête HTTP
- \`graphqlQuery\` - Requête GraphQL
- \`webhookSend\` - Envoyer webhook
- \`webhookReceive\` - Recevoir webhook
- \`oauthFlow\` - Authentification OAuth

**Notifications:**
- \`sendEmail\` - Envoyer email
- \`sendPushNotification\` - Notification push
- \`sendSMS\` - Envoyer SMS

**Files & Storage:**
- \`uploadFile\` - Uploader fichier
- \`downloadFile\` - Télécharger fichier
- \`processImage\` - Traiter image
- \`generatePDF\` - Générer PDF

**Scheduling:**
- \`scheduleCron\` - Planifier avec cron
- \`delayExecution\` - Délai d'exécution
- \`queueTask\` - Mettre en file

**AI Operations:**
- \`llmCall\` - Appel LLM
- \`generateEmbeddings\` - Générer embeddings
- \`generateImage\` - Générer image
- \`textToSpeech\` - Synthèse vocale
- \`sentimentAnalysis\` - Analyse sentiment

**Code Execution:**
- \`runJavaScript\` - Exécuter JavaScript
- \`runPython\` - Exécuter Python

**Connectors:**
- \`slackMessage\` - Message Slack
- \`linearIssue\` - Créer issue Linear
- \`githubAction\` - Action GitHub
- \`airtableRecord\` - Enregistrement Airtable`;

        // 🌊 Appel à l'API OpenAI avec STREAMING activé
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Tu es un assistant IA qui aide l'utilisateur à : 1/ créer des workflows d\'automatisation et itérer dessus 2/ l'aider à identifier les workflows dont il a besoin, suggérer, brainstormer intelligemment, lui poser les bonnes questions 3/ expliquer ou synthétiser un workflow complexe 4/ répondre à toute question sur le fonctionnement de l'application ou autre 5/ ignorer les thèmes qui ne sont pas liés au domaine de la plateforme, sauf si le contexte se prête à un sujet et permet de croiser les idées pour plus de pertinence.`

                            + ` Réponds de manière concise et utile, mais tu dois célébrer les réussites de l'utilisateur et être encourageant. Ta réponse doit être au format JSON avec les propriétés suivantes: title, workflowText, preferences.`

                            + ` Le title doit être un titre court, explicite et synthétique généré après tout le reste (max 40 caractères).`
                            + ` Le workflowText doit être le workflow complet au format XML.`
                            + ` Le preferences doit être le JSON des préférences d'affichage du workflow.`

                            + `\n\n${systemPrompt}`,
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 10000,
                temperature: 0.7,
                response_format: { type: "json_object" },
                stream: true, // 🔥 Activer le streaming !
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erreur OpenAI:', error);
            return c.json({
                error: 'Erreur lors de l\'appel à OpenAI',
                details: error,
                status: response.status,
            });
        }

        // 🌊 Configurer les headers pour Server-Sent Events (SSE)
        c.header('Content-Type', 'text/event-stream');
        c.header('Cache-Control', 'no-cache');
        c.header('Connection', 'keep-alive');

        // 🔥 Créer un stream de réponse
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let accumulatedText = '';

                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        
                        if (done) {
                            // 🎯 Stream terminé - valider le JSON accumulé
                            try {
                                const parsedWorkflow = JSON.parse(accumulatedText);
                                
                                // Vérifier les clés requises
                                if (!parsedWorkflow.title || !parsedWorkflow.workflowText || !parsedWorkflow.preferences) {
                                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                                        type: 'error', 
                                        error: 'JSON invalide - Clés manquantes' 
                                    })}\n\n`));
                                } else {
                                    // ✅ JSON valide - envoyer événement de succès
                                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                                        type: 'done',
                                        data: accumulatedText 
                                    })}\n\n`));
                                }
                            } catch (parseError) {
                                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                                    type: 'error', 
                                    error: 'JSON non parsable' 
                                })}\n\n`));
                            }
                            
                            controller.close();
                            break;
                        }

                        // Décoder le chunk reçu
                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n').filter(line => line.trim() !== '');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.substring(6);
                                
                                if (data === '[DONE]') {
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices?.[0]?.delta?.content || '';
                                    
                                    if (content) {
                                        accumulatedText += content;
                                        
                                        // 📤 Envoyer le chunk au frontend
                                        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                                            type: 'chunk', 
                                            content 
                                        })}\n\n`));
                                    }
                                } catch (e) {
                                    // Ignorer les erreurs de parsing de chunks individuels
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors du streaming:', error);
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                        type: 'error', 
                        error: 'Erreur de streaming' 
                    })}\n\n`));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        });

    } catch (error) {
        console.error('Erreur serveur:', error);
        return c.json({
            error: 'Erreur serveur',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        }, 500);
    }
});

// Route pour générer des UI avec l'IA
ai.post('/ui-builder', async (c) => {
    try {
        const { message } = await c.req.json();

        if (!message) {
            return c.json({ error: 'Message requis' }, 400);
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return c.json({
                error: 'OPENAI_API_KEY non configurée',
                hint: 'Ajoute OPENAI_API_KEY=sk-... dans ton .env'
            }, 500);
        }

        const systemPrompt = `Tu es un assistant IA spécialisé dans la génération d'interfaces utilisateur (UI) avec React.

## Ta mission
Convertir les descriptions en langage naturel en composants UI structurés au format JSON, prêts à être intégrés dans un page builder React.

## Structure de réponse OBLIGATOIRE

Tu DOIS répondre UNIQUEMENT avec un objet JSON valide contenant 1 propriété :

\`\`\`json
{
  "components": [
    {
      "id": "1750061847077-200990d3-714c-49e9-b90f-03bb1a80ebda",
      "displayName": "NomDuComposant",
      "context": "page",
      "props": {
        "text": "Contenu",
        "layout": "leftHeavy",
        "paddingX": "md",
        "background": "standard"
      },
      "updatedAt": 1756827602528
    }
  ]
}
\`\`\`

## Règles pour les composants

### Génération des IDs
- Format: \`{timestamp}-{uuid}\`
- Exemple: \`"1750061847077-200990d3-714c-49e9-b90f-03bb1a80ebda"\`
- Utilise le timestamp actuel (millisecondes) + un UUID v4

### Propriété \`displayName\`
Composants disponibles (selon le contexte) :

**Layout & Structure:**
- \`Section1Column\` - Section avec 1 colonne
- \`Section2Columns\` - Section avec 2 colonnes
- \`Column\` - Colonne (utilisée dans les sections)

**Headers & Footers:**
- \`BannerStGobain\` - Bannière/header personnalisée
- \`FooterStGobain\` - Footer personnalisé

**Content:**
- \`FancyTitle\` - Titre stylisé
- \`RichText\` - Texte riche (HTML)
- \`DocumentLibrary\` - Bibliothèque de documents

**Data Display:**
- \`EventsExplorer\` - Liste d'événements
- \`NewComers\` - Nouveaux arrivants
- \`LastNewsSlider\` - Slider de news
- \`ActiveProjectsTable\` - Tableau de projets actifs

### Propriété \`context\`
- **Root level**: \`"page"\` (pour les composants principaux)
- **Nested**: \`"{parentId}"\` ou \`"{parentId}.props.{slotName}"\`
- Exemples:
  - Composant dans Section1Column col: \`"1750060474719-25bebbe9-cd71-452c-a407-464940ab1ed7.props.col"\`
  - Composant dans Section2Columns col1: \`"1750060474719-543c718c-bbcb-494c-9620-781b517d86df.props.col1"\`
  - Composant dans Section2Columns col2: \`"1750060474719-543c718c-bbcb-494c-9620-781b517d86df.props.col2"\`
  - Composant enfant direct: \`"1750163138833-3f0a22e2-dd0d-4b57-97b8-554d2cb007fc"\`

### Propriété \`props\`
Props communs selon le type de composant :

**Section1Column / Section2Columns:**
\`\`\`json
{
  "paddingX": "sm" | "md" | "lg" | "xl",
  "paddingY": "sm" | "md" | "lg" | "xl",
  "background": "standard" | "offset1" | "offset2" | "primary",
  "layout": "balanced" | "leftHeavy" | "rightHeavy" (pour Section2Columns),
  "alignment": "none" | "center" | "left" | "right"
}
\`\`\`

**Column:**
\`\`\`json
{
  "gapSize": "sm" | "md" | "lg" | "xl"
}
\`\`\`

**FancyTitle:**
\`\`\`json
{
  "text": "Titre du composant"
}
\`\`\`

**BannerStGobain / RichText:**
\`\`\`json
{
  "text": "<h1><strong>Titre</strong></h1><p>Contenu HTML...</p>"
}
\`\`\`

**EventsExplorer:**
\`\`\`json
{
  "showViewAllLink": true,
  "viewAllLinkRedirectPageId": 6
}
\`\`\`

**DocumentLibrary:**
\`\`\`json
{
  "areRootFoldersUsedAsTabs": true,
  "areTabsLocatedOnTheSide": true
}
\`\`\`

### Propriété \`updatedAt\`
- Timestamp en millisecondes
- Optionnel, mais recommandé pour les composants modifiés

## Conventions de structure

### Hiérarchie typique d'une page :

1. **Banner** (context: "page")
2. **Section2Columns** (context: "page")
   - **Column** (context: "{sectionId}.props.col1")
     - **FancyTitle** (context: "{columnId}")
     - **Composants de contenu** (context: "{columnId}")
   - **Column** (context: "{sectionId}.props.col2")
     - **FancyTitle** (context: "{columnId}")
     - **Composants de contenu** (context: "{columnId}")
3. **Section1Column** (context: "page")
   - **Column** (context: "{sectionId}.props.col")
     - **Composants de contenu** (context: "{columnId}")
4. **Footer** (context: "page")

## Exemple complet

Demande utilisateur: "Créer une page d'accueil avec un banner, une section 2 colonnes pour les événements et nouveaux arrivants, et un footer"

Réponse:
\`\`\`json
{
  "components": [
    {
      "id": "1750061847077-200990d3-714c-49e9-b90f-03bb1a80ebda",
      "displayName": "BannerStGobain",
      "context": "page",
      "props": {
        "text": "<h1><strong>Bienvenue</strong></h1><p>Page d'accueil de notre plateforme</p>"
      },
      "updatedAt": 1756827602528
    },
    {
      "id": "1750060474719-543c718c-bbcb-494c-9620-781b517d86df",
      "displayName": "Section2Columns",
      "context": "page",
      "props": {
        "layout": "balanced",
        "paddingX": "md",
        "paddingY": "lg",
        "background": "offset2"
      },
      "updatedAt": 1754076213314
    },
    {
      "id": "1750163138833-3f0a22e2-dd0d-4b57-97b8-554d2cb007fc",
      "displayName": "Column",
      "context": "1750060474719-543c718c-bbcb-494c-9620-781b517d86df.props.col1",
      "props": {
        "gapSize": "md"
      }
    },
    {
      "id": "1750163138833-97cc8a12-fb81-4c65-a659-5232513871ad",
      "displayName": "Column",
      "context": "1750060474719-543c718c-bbcb-494c-9620-781b517d86df.props.col2",
      "props": {
        "gapSize": "md"
      }
    },
    {
      "id": "1750163138833-339eda94-02c2-4c9f-ab75-c2bef52f8180",
      "displayName": "FancyTitle",
      "context": "1750163138833-3f0a22e2-dd0d-4b57-97b8-554d2cb007fc",
      "props": {
        "text": "Événements"
      }
    },
    {
      "id": "1750060474719-199fbf07-d004-47f6-9682-a0121ff2ec10",
      "displayName": "EventsExplorer",
      "context": "1750163138833-3f0a22e2-dd0d-4b57-97b8-554d2cb007fc",
      "props": {
        "showViewAllLink": true,
        "viewAllLinkRedirectPageId": 6
      }
    },
    {
      "id": "1750163138833-0a1b7712-0a83-4498-9059-f38bff3749b3",
      "displayName": "FancyTitle",
      "context": "1750163138833-97cc8a12-fb81-4c65-a659-5232513871ad",
      "props": {
        "text": "Nouveaux arrivants"
      }
    },
    {
      "id": "1750147376071-867b7faf-0a82-4d3c-889e-6f4c8eeab3ad",
      "displayName": "NewComers",
      "context": "1750163138833-97cc8a12-fb81-4c65-a659-5232513871ad"
    },
    {
      "id": "1750061315086-533859ff-74f6-4f29-a813-fd6b8efa5390",
      "displayName": "FooterStGobain",
      "context": "page"
    }
  ]
}
\`\`\`

## VALIDATION OBLIGATOIRE AVANT ENVOI

**AVANT de renvoyer ta réponse, tu DOIS IMPÉRATIVEMENT effectuer cette auto-vérification :**

1. ✅ Ta réponse commence-t-elle DIRECTEMENT par \`{\` ?
2. ✅ Ta réponse se termine-t-elle par \`}\` ?
3. ✅ Ton JSON contient-il la clé \`components\` avec un tableau ?
4. ✅ Chaque composant a-t-il les propriétés \`id\`, \`displayName\`, \`context\` ?
5. ✅ Les IDs sont-ils au format \`{timestamp}-{uuid}\` ?
6. ✅ Les \`context\` imbriqués référencent-ils bien les IDs parents ?
7. ✅ Peux-tu mentalement exécuter \`JSON.parse()\` sur ta réponse sans erreur ?

**Si une seule réponse est NON, CORRIGE avant d'envoyer.**

Le code qui recevra ta réponse fera directement :
\`\`\`javascript
const result = JSON.parse(data.message);
// result.components sera utilisé directement
\`\`\`

**Cela DOIT fonctionner sans aucune manipulation supplémentaire.**

Tu es prêt à générer des interfaces utilisateur structurées !`;

        // Appel à l'API OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 10000, // Plus élevé pour générer des UI complexes
                temperature: 0.7,
                response_format: { type: "json_object" }, // Force JSON
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erreur OpenAI:', error);
            return c.json({
                error: 'Erreur lors de l\'appel à OpenAI',
                details: error,
                status: response.status,
            });
        }

        const data = await response.json();
        const aiMessage = (data as { choices: { message: { content: string } }[] }).choices[0]?.message?.content || 'Pas de réponse';

        // 🔍 Validation du JSON avant de renvoyer au frontend
        try {
            const parsedComponents = JSON.parse(aiMessage);

            // Vérifier que la clé "components" existe et est un tableau
            if (!parsedComponents.components || !Array.isArray(parsedComponents.components)) {
                console.error('❌ JSON invalide - Clé components manquante ou invalide');

                return c.json({
                    error: 'Réponse IA invalide - Format JSON incorrect',
                    details: 'La clé "components" (tableau) est requise',
                    received: Object.keys(parsedComponents),
                }, 500);
            }

            // ✅ JSON valide et complet
            console.log('✅ UI Components JSON validé avec succès:', {
                componentsCount: parsedComponents.components.length,
            });

            return c.json({
                success: true,
                message: aiMessage,
                usage: (data as { usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }).usage,
            });

        } catch (parseError) {
            console.error('❌ Erreur de parsing JSON:', parseError);
            console.error('Message reçu:', aiMessage.substring(0, 500) + '...');

            return c.json({
                error: 'Réponse IA non parsable',
                details: parseError instanceof Error ? parseError.message : 'JSON invalide',
                preview: aiMessage.substring(0, 200),
            }, 500);
        }

    } catch (error) {
        console.error('Erreur serveur:', error);
        return c.json({
            error: 'Erreur serveur',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        }, 500);
    }
});

export default ai;

