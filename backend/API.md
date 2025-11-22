# 📚 API Documentation - Workflow Automation

## 🚀 Démarrage rapide

### 1. Démarrer MongoDB

```bash
cd /Users/jordancaron/Desktop/dev/automation-poc
docker-compose up -d
```

### 2. Démarrer le backend

```bash
cd backend
bun run dev
```

Le serveur démarre sur **http://localhost:3000**

### 3. Insérer des données de test

```bash
cd backend
bun run src/seed.ts
```

---

## 📋 Endpoints API

### Base URL : `http://localhost:3000`

---

## 🔹 **GET /** - Page d'accueil

Retourne les informations de l'API.

**Exemple :**
```bash
curl http://localhost:3000
```

**Réponse :**
```json
{
  "message": "API Workflow Automation",
  "version": "1.0.0",
  "endpoints": {
    "workflows": "/api/workflows"
  }
}
```

---

## 🔹 **GET /api/workflows** - Liste tous les workflows

**Exemple :**
```bash
curl http://localhost:3000/api/workflows
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "_id": "673f2a1b8c4d5e6f7a8b9c0d",
      "title": "Workflow de test simple",
      "description": "Un workflow basique pour valider l'API",
      "isEnabled": true,
      "workflowXML": "<workflow>...</workflow>",
      "preferences": {
        "zoom": 1,
        "panX": 0,
        "panY": 0
      },
      "createdAt": "2025-11-21T10:30:00.000Z",
      "updatedAt": "2025-11-21T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 🔹 **GET /api/workflows/:id** - Récupérer un workflow

**Exemple :**
```bash
curl http://localhost:3000/api/workflows/673f2a1b8c4d5e6f7a8b9c0d
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "_id": "673f2a1b8c4d5e6f7a8b9c0d",
    "title": "Workflow de test simple",
    "workflowXML": "<workflow>...</workflow>",
    ...
  }
}
```

**Erreur (404) :**
```json
{
  "success": false,
  "error": "Workflow non trouvé"
}
```

---

## 🔹 **POST /api/workflows** - Créer un nouveau workflow

**Headers :**
```
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "title": "Mon nouveau workflow",
  "description": "Description optionnelle",
  "isEnabled": true,
  "workflowXML": "<workflow><boundary id=\"START\" title=\"Début\" /></workflow>"
}
```

**Exemple curl :**
```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test workflow",
    "workflowXML": "<workflow><boundary id=\"START\" /></workflow>"
  }'
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "_id": "673f2a1b8c4d5e6f7a8b9c0d",
    "title": "Mon nouveau workflow",
    ...
  },
  "message": "Workflow créé avec succès"
}
```

**Erreur (400) :**
```json
{
  "success": false,
  "error": "Les champs \"title\" et \"workflowXML\" sont requis"
}
```

---

## 🔹 **PUT /api/workflows/:id** - Modifier un workflow

**Exemple :**
```bash
curl -X PUT http://localhost:3000/api/workflows/673f2a1b8c4d5e6f7a8b9c0d \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Titre modifié",
    "isEnabled": false
  }'
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "_id": "673f2a1b8c4d5e6f7a8b9c0d",
    "title": "Titre modifié",
    "isEnabled": false,
    ...
  },
  "message": "Workflow modifié avec succès"
}
```

---

## 🔹 **DELETE /api/workflows/:id** - Supprimer un workflow

**Exemple :**
```bash
curl -X DELETE http://localhost:3000/api/workflows/673f2a1b8c4d5e6f7a8b9c0d
```

**Réponse :**
```json
{
  "success": true,
  "message": "Workflow supprimé avec succès"
}
```

---

## 🧪 Tests avec curl (copier-coller)

### Créer un workflow
```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test API",
    "workflowXML": "<workflow><action id=\"TEST\" title=\"Test\" /></workflow>"
  }'
```

### Lister tous les workflows
```bash
curl http://localhost:3000/api/workflows
```

### Récupérer un workflow (remplacer l'ID)
```bash
curl http://localhost:3000/api/workflows/VOTRE_ID_ICI
```

### Modifier un workflow (remplacer l'ID)
```bash
curl -X PUT http://localhost:3000/api/workflows/VOTRE_ID_ICI \
  -H "Content-Type: application/json" \
  -d '{"title": "Nouveau titre"}'
```

### Supprimer un workflow (remplacer l'ID)
```bash
curl -X DELETE http://localhost:3000/api/workflows/VOTRE_ID_ICI
```

---

## 📊 Structure du modèle Workflow

```typescript
{
  _id: ObjectId,                    // Généré automatiquement
  title: string,                    // Requis
  description?: string,             // Optionnel
  fragmentId?: string,              // Optionnel
  isEnabled: boolean,               // Par défaut: true
  workflowXML: string,              // Requis
  preferences?: {
    zoom?: number,                  // Par défaut: 1
    panX?: number,                  // Par défaut: 0
    panY?: number,                  // Par défaut: 0
  },
  createdBy?: {
    id: string,
    email: string,
    displayName: string,
  },
  createdAt: Date,                  // Généré automatiquement
  updatedAt: Date,                  // Mis à jour automatiquement
}
```

---

## 🎯 TODO / Prochaines étapes

- [ ] **Map Engine** : Endpoint `/api/workflows/:id/map` pour générer la visualisation
- [ ] **Validation XML** : Valider le format du workflowXML
- [ ] **Authentification** : JWT + système de permissions
- [ ] **Workflow Instances** : Modèle pour l'exécution
- [ ] **Recherche** : Endpoint `/api/workflows/search?q=...`
- [ ] **Pagination** : Limiter les résultats (ex: ?page=1&limit=10)

---

## 🐛 Debugging

### Vérifier la connexion MongoDB
```bash
docker ps | grep mongo
```

### Logs du backend
Le backend affiche :
```
✅ MongoDB connecté (état: 1)
```
Si l'état est **1**, c'est connecté !

### Réinitialiser la base de données
```bash
# Arrêter MongoDB
docker-compose down

# Supprimer les volumes
docker-compose down -v

# Redémarrer
docker-compose up -d

# Re-seed
cd backend && bun run src/seed.ts
```

---

**Dernière mise à jour** : 21 novembre 2025

