# 🌊 Streaming AI - Chain of Thoughts en Temps Réel

## 🎯 Objectif

Afficher le "chain of thoughts" de l'IA **en français** pendant que l'appel API à ChatGPT se fait, au lieu d'attendre 10-15 secondes avec un écran figé. Le workflow final (JSON) est généré et appliqué uniquement à la fin, de manière transparente.

## ✨ Fonctionnalités Implémentées

### 🧠 Séparation Chain of Thoughts / Workflow JSON

**Concept clé :**
- **Avant le délimiteur `---WORKFLOW_JSON---`** : L'IA parle en français, explique son raisonnement
- **Après le délimiteur** : Le JSON du workflow (masqué dans l'affichage)

**Format de réponse de l'IA :**
```
Bonjour ! Je comprends que tu veux créer un workflow de validation.

Voici ce que je vais faire :
1. Créer une action pour vérifier les données
2. Ajouter une condition pour valider
3. Gérer les erreurs potentielles

---WORKFLOW_JSON---
{"title":"Validation de données","workflowText":"<workflow>...</workflow>","preferences":{...}}
```

**Ce que l'utilisateur voit :**
```
Bonjour ! Je comprends que tu veux créer un workflow de validation.

Voici ce que je vais faire :
1. Créer une action pour vérifier les données
2. Ajouter une condition pour valider
3. Gérer les erreurs potentielles
```

### Backend (`backend/src/routes/ai.routes.ts`)

1. **Streaming OpenAI activé**
   - Ajout du paramètre `stream: true` dans l'appel à l'API OpenAI
   - Les réponses arrivent mot par mot au lieu d'un bloc unique
   - **PAS de `response_format: json_object`** pour permettre le texte libre

2. **Server-Sent Events (SSE)**
   - Le backend transforme le stream OpenAI en événements SSE
   - Format : `text/event-stream`
   - Connexion maintenue ouverte pendant toute la durée du stream

3. **Types d'événements envoyés**
   ```typescript
   // Chunk de texte reçu (conversation + JSON potentiel)
   { type: 'chunk', content: 'mot ou phrase' }
   
   // Stream terminé avec JSON extrait (ou null si conversation pure)
   { type: 'done', data: '{"title":"...","workflowText":"...","preferences":{...}}' }
   // OU
   { type: 'done', data: null }  // Si juste une conversation
   
   // Erreur survenue
   { type: 'error', error: 'message d\'erreur' }
   ```

4. **Extraction et validation du JSON à la fin**
   - Le texte complet est accumulé pendant le stream
   - À la fin, on cherche le délimiteur `---WORKFLOW_JSON---`
   - Si trouvé : on extrait le JSON après le délimiteur et on valide
   - Si pas trouvé : c'est une conversation pure (pas de workflow)
   - Envoi d'un événement `done` avec le JSON extrait (ou `null`)

### Frontend (`frontend/src/.../polygon-sidebar-designer-view.tsx`)

1. **Gestion des messages**
   - State `messages` pour stocker l'historique de conversation
   - Type `Message` avec `role`, `content`, `isStreaming`

2. **Lecture du stream**
   - Utilisation de `fetch()` avec `response.body.getReader()`
   - Décodage progressif des chunks SSE
   - Mise à jour du message en temps réel

3. **Nettoyage de l'affichage et Rendu Markdown**
   - Détection du délimiteur `---WORKFLOW_JSON---` dans le contenu
   - **Affichage uniquement du texte AVANT le délimiteur** (conversation)
   - Le JSON est masqué de l'interface utilisateur
   - **Rendu markdown** avec `react-markdown` pour les messages assistant
   - Support complet : titres, listes, code, emphase, citations
   - Animation de curseur clignotant pendant le streaming

4. **Mise à jour du workflow (si JSON présent)**
   - Une fois le JSON complet reçu (événement `done`)
   - **SI** `data !== null` → Parsing et mise à jour du workflow
   - **SINON** → Conversation pure, pas de mise à jour
   - Gestion des erreurs avec rollback et logs

### UI/UX (`polygon-sidebar-designer-view.module.scss`)

1. **Styles des messages**
   - Messages utilisateur : fond violet clair, alignés à droite
   - Messages assistant : fond gris clair, alignés à gauche
   - Icônes distinctes (User vs Bot)

2. **Animations**
   - `fadeIn` : apparition douce des messages
   - `blink` : curseur clignotant pendant le streaming

3. **Responsive**
   - Texte avec `pre-wrap` pour préserver les sauts de ligne
   - `word-wrap` pour éviter les débordements

## 🔄 Flux de Données

```
┌─────────────┐
│   Frontend  │
│  (Textarea) │
└──────┬──────┘
       │ User envoie "Créer un workflow..."
       ▼
┌─────────────────────┐
│  handleSendMessage  │
│  - Crée userMessage │
│  - Crée assistantMessage (vide, isStreaming: true)
└──────┬──────────────┘
       │ POST /api/ai/chat
       ▼
┌────────────────────────────┐
│  Backend (Hono)            │
│  - Reçoit message          │
│  - Appelle OpenAI (stream: true)
└──────┬─────────────────────┘
       │ Stream SSE
       ▼
┌────────────────────────────┐
│  OpenAI API                │
│  - Génère JSON progressivement
│  - Envoie chunks          │
└──────┬─────────────────────┘
       │ Chunks OpenAI
       ▼
┌────────────────────────────┐
│  Backend (ReadableStream)  │
│  - Reçoit chunks OpenAI    │
│  - Transforme en SSE       │
│  - Envoie { type: 'chunk', content: '...' }
└──────┬─────────────────────┘
       │ SSE Events
       ▼
┌────────────────────────────┐
│  Frontend (Reader)         │
│  - Lit événements SSE      │
│  - Accumule contenu        │
│  - Met à jour UI en temps réel
│  - Affiche "chain of thoughts" ⚡
└──────┬─────────────────────┘
       │ Stream terminé
       ▼
┌────────────────────────────┐
│  Backend                   │
│  - Valide JSON complet     │
│  - Envoie { type: 'done', data: JSON }
└──────┬─────────────────────┘
       │ JSON complet
       ▼
┌────────────────────────────┐
│  Frontend                  │
│  - Parse JSON              │
│  - Met à jour workflow     │
│  - Désactive isStreaming   │
└────────────────────────────┘
```

## 🎨 Expérience Utilisateur

### Avant (sans streaming)
```
User: "Créer un workflow de validation"
        ↓
[Spinner pendant 10-15 secondes] ⏳
        ↓
✅ Workflow créé !
```

### Après (avec streaming et chain of thoughts) ⭐

#### Cas 1 : Création de workflow
```
User: "Créer un workflow de validation"
        ↓
Bot: "Parfait ! Je comprends que..."  [< 1 seconde] ⚡
Bot: "Parfait ! Je comprends que tu veux créer..."  [streaming...]
Bot: "Parfait ! Je comprends que tu veux créer un workflow..."  [streaming...]
Bot: [texte complet en français visible]
        ↓
✅ Workflow créé automatiquement en arrière-plan !
```

**Ce que l'utilisateur voit :**
```
Bot 🤖
Parfait ! Je comprends que tu veux créer un workflow de validation.

Voici ce que je vais mettre en place :
1. Une action pour vérifier les données entrantes
2. Une condition pour valider la conformité
3. Une gestion des erreurs avec notifications

Le workflow est maintenant créé et prêt à être personnalisé ! 🎉
```

#### Cas 2 : Conversation pure (sans workflow)
```
User: "C'est quoi une action dbRead ?"
        ↓
Bot: "Bonne question !"  [< 1 seconde]
Bot: "Bonne question ! Une action dbRead..."  [streaming...]
Bot: [explication complète]
        ↓
💬 Conversation uniquement (pas de workflow créé)
```

**Ce que l'utilisateur voit :**
```
Bot 🤖
Bonne question ! Une action dbRead permet de lire des données depuis une base de données.

Elle est utile pour :
- Récupérer des informations stockées
- Effectuer des requêtes SQL
- Charger des configurations

Tu veux que je crée un exemple de workflow avec dbRead ?
```

## 🔧 Points Techniques Importants

### 1. Délimiteur de Séparation Conversation/JSON

**Problème** : Comment afficher du texte conversationnel ET générer un JSON workflow ?

**Solution - Délimiteur `---WORKFLOW_JSON---` :**

```typescript
// Backend : Extraction du JSON
const delimiter = '---WORKFLOW_JSON---';
const delimiterIndex = accumulatedText.indexOf(delimiter);

if (delimiterIndex !== -1) {
    const jsonPart = accumulatedText.substring(delimiterIndex + delimiter.length).trim();
    const parsedWorkflow = JSON.parse(jsonPart);
    // Envoyer le JSON au frontend
}
```

```typescript
// Frontend : Nettoyage de l'affichage
const delimiter = '---WORKFLOW_JSON---';
let displayContent = accumulatedContent;

const delimiterIndex = displayContent.indexOf(delimiter);
if (delimiterIndex !== -1) {
    // Afficher UNIQUEMENT le texte avant le délimiteur
    displayContent = displayContent.substring(0, delimiterIndex).trim();
}
```

### 2. Pas de `response_format: json_object`

**Important** : On n'utilise PLUS `response_format: { type: "json_object" }` car :
- Ça forcerait l'IA à retourner UNIQUEMENT du JSON
- On veut du texte libre + JSON optionnel
- Le délimiteur permet de séparer les deux

### 3. Gestion des Erreurs avec Try-Catch

**Types d'erreurs gérées** :
- Erreur réseau (fetch failed)
- Erreur OpenAI (API key invalide, quota dépassé)
- Erreur parsing JSON (réponse malformée, clés manquantes)
- Interruption du stream
- Délimiteur absent mais JSON attendu

**Try-catch côté Backend :**
```typescript
try {
    const jsonPart = accumulatedText.substring(delimiterIndex + delimiter.length).trim();
    const parsedWorkflow = JSON.parse(jsonPart);
    
    if (!parsedWorkflow.title || !parsedWorkflow.workflowText || !parsedWorkflow.preferences) {
        // Erreur : clés manquantes
    }
} catch (parseError) {
    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
        type: 'error', 
        error: 'Erreur parsing workflow'
    })}\n\n`));
}
```

**Try-catch côté Frontend :**
```typescript
try {
    const parsedData = JSON.parse(fullJsonResponse);
    const { title, workflowText, preferences } = parsedData;
    // Mise à jour du workflow...
} catch (parseError) {
    console.error('Erreur parsing workflow JSON:', parseError);
}

// Gestion globale
catch (error) {
    setMessages(prev => 
        prev.map(msg => 
            msg.id === assistantMessageId 
                ? { ...msg, content: `❌ Erreur: ...`, isStreaming: false }
                : msg
        )
    );
}
```

### 4. Performance et Optimisations

- **Pas de re-render inutile** : on met à jour uniquement le message concerné avec `.map()`
- **Auto-scroll désactivé** (commenté) pour éviter les sauts lors du streaming
- **Décodage progressif** avec `TextDecoder({ stream: true })`
- **Nettoyage du contenu à chaque chunk** : le délimiteur et JSON sont retirés en temps réel
- **Double validation** : côté backend ET frontend pour garantir l'intégrité

## 🚀 Comment Tester

1. **Démarrer le backend**
   ```bash
   cd backend
   bun run dev
   ```

2. **Démarrer le frontend**
   ```bash
   cd frontend
   bun run dev
   ```

3. **Ouvrir l'app et aller dans un workflow**

4. **Cliquer sur l'icône AI (Bot) dans la sidebar**

5. **Taper un message et observer le streaming** 🌊

   **Exemples de demandes qui créent un workflow :**
   - "Créer un workflow de validation de formulaire"
   - "Je veux automatiser l'envoi d'emails de bienvenue"
   - "Construis-moi un workflow de traitement de commandes"
   
   **Exemples de conversations pures (sans workflow) :**
   - "C'est quoi une action dbRead ?"
   - "Explique-moi comment fonctionnent les conditions"
   - "Quelles sont les bonnes pratiques ?"
   
   **Observer :**
   - Le texte en français apparaît progressivement ⚡
   - Le curseur clignote pendant le streaming ▊
   - Le JSON n'est JAMAIS visible dans le chat
   - Le workflow est créé automatiquement en arrière-plan (si applicable)

## 📝 Support Markdown ✅

### Implémenté avec `react-markdown`

L'IA peut maintenant utiliser du markdown pour formater ses réponses :

**Fonctionnalités supportées :**
- ✅ **Titres** : `# H1`, `## H2`, `### H3`
- ✅ **Emphase** : `**gras**`, `*italique*`
- ✅ **Listes** : Numérotées et à puces (avec sous-listes)
- ✅ **Code** : `` `inline` `` et blocs de code avec ```
- ✅ **Citations** : `> Blockquote`
- ✅ **GitHub Flavored Markdown** : Tables, task lists, etc.

**Exemple de réponse markdown :**
```markdown
## 🎯 Voici ce que je vais créer :

1. **Action de validation**
   - Vérification des champs requis
   - Format email avec `regex`

2. **Sauvegarde des données**
   - Utilisation de `dbCreate`
   - Transaction sécurisée

> 💡 **Astuce** : Tu peux personnaliser ces règles !

Le workflow est créé ! 🎉
```

**Voir** : `MARKDOWN_SUPPORT.md` pour la documentation complète

## 📝 Améliorations Futures Possibles

1. ~~**Markdown Rendering**~~ ✅ **Fait !**
   - ✅ Parser le markdown dans les réponses (gras, listes, code blocks)

2. **Code Syntax Highlighting**
   - Si l'IA envoie du code XML/JSON, le colorer

3. **Stop Button**
   - Permettre d'annuler le stream en cours
   - Utiliser `AbortController`

4. **Historique Persistant**
   - Sauvegarder les conversations dans localStorage
   - Reprendre la conversation où on l'a laissée

5. **Multi-turn Conversation**
   - Envoyer l'historique complet à l'IA
   - Context awareness pour les questions de suivi

6. **Retry Mechanism**
   - Bouton "Réessayer" en cas d'erreur
   - Reconnexion automatique si le stream échoue

## ⚠️ Notes Importantes

- L'API OpenAI doit supporter le streaming (gpt-4o-mini ✅)
- Le format `response_format: { type: "json_object" }` fonctionne avec le streaming
- Les CORS doivent être correctement configurés sur le backend
- Le streaming consomme autant de tokens qu'une réponse classique

## 🎉 Résultat Final

### ✅ Avantages de cette Approche

1. **Conversation Naturelle** 💬
   - L'IA parle en français, comme un assistant humain
   - Explications claires et pédagogiques
   - Peut poser des questions de clarification

2. **Feedback Instantané** ⚡
   - Texte visible en < 1 seconde
   - Pas d'attente dans le vide
   - L'utilisateur sait que ça marche

3. **Transparence du Raisonnement** 🧠
   - Chain of thoughts visible en temps réel
   - L'utilisateur comprend ce que l'IA fait
   - Création de confiance

4. **Workflow Automatique** 🎯
   - Le JSON est généré et appliqué en arrière-plan
   - L'utilisateur n'a pas besoin de voir le code technique
   - Expérience fluide et professionnelle

5. **Flexibilité** 🔄
   - Peut répondre à des questions sans créer de workflow
   - Peut créer/modifier des workflows quand nécessaire
   - S'adapte au contexte de la conversation

### 🚀 Expérience Utilisateur Transformée

**Avant :**
```
User: "Créer un workflow"
[Écran figé 15 secondes]
✅ Fait
```

**Maintenant :**
```
User: "Créer un workflow"

Bot: "Parfait ! Je comprends..." [instantané]
Bot: "Je vais créer..." [streaming visible]
Bot: "Voici les étapes..." [explication complète]

✅ Workflow créé automatiquement !
```

L'utilisateur voit maintenant le "raisonnement" de l'IA se construire en temps réel **en français**, créant une expérience beaucoup plus engageante, transparente et professionnelle ! 🚀

