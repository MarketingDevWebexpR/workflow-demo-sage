# 🚀 Automation POC

Proof of Concept pour un système d'automatisation de workflows avec séparation backend/frontend.

## 📋 Stack Technique

### Backend
- **Runtime** : Bun (plus rapide que Node.js)
- **Framework** : Hono (équivalent Express moderne)
- **Base de données** : MongoDB
- **ORM** : Mongoose
- **Langage** : TypeScript

### Frontend *(à venir)*
- React 18 + Vite
- Radix UI + Tailwind CSS
- Zustand (state management)
- React Hook Form + Zod

---

## 🏗️ Structure du projet

```
automation-poc/
├── backend/              # API REST
│   ├── src/
│   │   ├── models/       # Modèles Mongoose
│   │   ├── routes/       # Routes API
│   │   ├── seed.ts       # Données de test
│   │   └── index.ts      # Point d'entrée
│   ├── package.json
│   └── API.md           # Documentation API
├── frontend/            # (à créer)
├── docker-compose.yml   # MongoDB
└── README.md
```

---

## 🚀 Installation et démarrage

### Prérequis
- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com) & Docker Compose

### 1. Cloner le projet
```bash
git clone <url>
cd automation-poc
```

### 2. Démarrer MongoDB
```bash
docker-compose up -d
```

### 3. Installer les dépendances backend
```bash
cd backend
bun install
```

### 4. Insérer des données de test
```bash
bun run seed
```

### 5. Démarrer le serveur backend
```bash
bun run dev
```

Le backend est accessible sur **http://localhost:3000**

---

## 🧪 Tester l'API

### Vérifier que l'API répond
```bash
curl http://localhost:3000
```

### Lister les workflows
```bash
curl http://localhost:3000/api/workflows
```

### Créer un workflow
```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon workflow",
    "workflowXML": "<workflow><action id=\"TEST\" /></workflow>"
  }'
```

📖 **Documentation complète** : Voir [`backend/API.md`](backend/API.md)

---

## 📦 Scripts disponibles

### Backend
```bash
cd backend

# Développement (avec hot-reload)
bun run dev

# Insérer des données de test
bun run seed
```

---

## 🗺️ Roadmap

- [x] ✅ Modèle Mongoose pour Workflows
- [x] ✅ API CRUD basique
- [x] ✅ Script de seed
- [ ] 🔄 Map Engine (visualisation de workflows)
- [ ] 🔄 Système d'exécution de workflows
- [ ] 🔄 Frontend React
- [ ] 🔄 Authentification JWT
- [ ] 🔄 Tests unitaires

---

## 📚 Ressources

- **Code source Polygon** : `/Users/jordancaron/Desktop/dev/2025-react-spfx-webexpr-polygon`
- **Analyse des workflows** : Voir `WORKFLOW_ANALYSIS_PSR_VS_ESCROW.md` dans Polygon

---

## 👤 Auteur

**Jordan Caron** - Développeur SPFX/React en transition vers le fullstack

---

## 📝 License

Ce projet est un POC personnel d'apprentissage.

