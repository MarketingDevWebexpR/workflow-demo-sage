# 🌊 Streaming AI - Chain of Thoughts en Temps Réel

## 🎯 Objectif

Afficher le "chain of thoughts" de l'IA pendant que l'appel API à ChatGPT se fait, au lieu d'attendre 10-15 secondes avec un écran figé.

## ✨ Fonctionnalités Implémentées

### Backend (`backend/src/routes/ai.routes.ts`)

1. **Streaming OpenAI activé**
   - Ajout du paramètre `stream: true` dans l'appel à l'API OpenAI
   - Les réponses arrivent mot par mot au lieu d'un bloc unique

2. **Server-Sent Events (SSE)**
   - Le backend transforme le stream OpenAI en événements SSE
   - Format : `text/event-stream`
   - Connexion maintenue ouverte pendant toute la durée du stream

3. **Types d'événements envoyés**
   ```typescript
   // Chunk de texte reçu
   { type: 'chunk', content: 'mot ou phrase' }
   
   // Stream terminé avec JSON complet
   { type: 'done', data: '{"title":"...","workflowText":"...","preferences":{...}}' }
   
   // Erreur survenue
   { type: 'error', error: 'message d\'erreur' }
   ```

4. **Validation du JSON à la fin**
   - Le texte est accumulé pendant le stream
   - À la fin, on valide que c'est un JSON valide avec les clés requises
   - Envoi d'un événement `done` avec le JSON complet

### Frontend (`frontend/src/.../polygon-sidebar-designer-view.tsx`)

1. **Gestion des messages**
   - State `messages` pour stocker l'historique de conversation
   - Type `Message` avec `role`, `content`, `isStreaming`

2. **Lecture du stream**
   - Utilisation de `fetch()` avec `response.body.getReader()`
   - Décodage progressif des chunks SSE
   - Mise à jour du message en temps réel

3. **Affichage progressif**
   - Chaque chunk reçu est ajouté au contenu du message
   - Animation de curseur clignotant pendant le streaming
   - Auto-scroll vers le bas quand de nouveaux messages arrivent

4. **Mise à jour du workflow**
   - Une fois le JSON complet reçu (événement `done`)
   - Parsing et mise à jour du workflow dans le store
   - Gestion des erreurs avec rollback

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

### Après (avec streaming) ⭐
```
User: "Créer un workflow de validation"
        ↓
Bot: "{"  [< 1 seconde]
Bot: "{\"title"  [streaming...]
Bot: "{\"title\":\"Validation"  [streaming...]
Bot: "{\"title\":\"Validation de données\",\"workflow"  [streaming...]
... [l'utilisateur voit le texte s'écrire en temps réel]
        ↓
✅ Workflow créé ! [après 10-15 secondes mais avec feedback visuel]
```

## 🔧 Points Techniques Importants

### 1. Double Validation du JSON

**Problème** : On stream du texte brut mais on a besoin de JSON valide à la fin.

**Solution** :
- Le texte est affiché progressivement tel quel (chain of thoughts visible)
- Le JSON est accumulé dans `accumulatedContent`
- À la fin, on parse le JSON complet pour mettre à jour le workflow
- Si le parsing échoue, on affiche une erreur

### 2. Gestion des Erreurs

**Types d'erreurs gérées** :
- Erreur réseau (fetch failed)
- Erreur OpenAI (API key invalide, quota dépassé)
- Erreur parsing JSON (réponse malformée)
- Interruption du stream

**Try-catch** :
```typescript
try {
  // Lecture du stream
} catch (error) {
  // Met à jour le message assistant avec l'erreur
  setMessages(prev => 
    prev.map(msg => 
      msg.id === assistantMessageId 
        ? { ...msg, content: `❌ Erreur: ...`, isStreaming: false }
        : msg
    )
  );
}
```

### 3. Performance

- Pas de re-render inutile : on met à jour uniquement le message concerné
- Auto-scroll optimisé avec `behavior: 'smooth'`
- Décodage progressif avec `TextDecoder({ stream: true })`

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
   - "Créer un workflow de validation de formulaire"
   - Observer le texte apparaître progressivement
   - Observer le curseur clignotant pendant le streaming

## 📝 Améliorations Futures Possibles

1. **Markdown Rendering**
   - Parser le markdown dans les réponses (gras, listes, code blocks)

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

## 🎉 Résultat

Au lieu d'attendre 10-15 secondes dans le vide, l'utilisateur voit maintenant le "raisonnement" de l'IA se construire en temps réel, créant une expérience beaucoup plus engageante et transparente ! 🚀

