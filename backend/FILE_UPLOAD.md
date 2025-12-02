# 📂 Système de Gestion de Fichiers

## 🎯 Vue d'ensemble

Ce système permet d'uploader, télécharger et supprimer des fichiers de manière sécurisée avec stockage local dans le dossier `uploads/`.

## 📁 Structure des fichiers

```
backend/
├── uploads/                      # Dossier de stockage (ignoré par Git)
│   ├── avatars/                 # Images d'avatars
│   ├── documents/               # Documents (PDF, images, etc.)
│   └── .gitkeep                 # Garde le dossier dans Git
├── src/
│   ├── services/
│   │   └── file.service.ts      # Logique métier (upload/download/delete)
│   └── routes/
│       └── files.routes.ts      # Endpoints API
```

## 🚀 Fonctionnalités

### ✅ Upload de fichiers
- Validation du type de fichier (vérification du MIME type réel, pas juste l'extension)
- Génération automatique de noms uniques (timestamp + sanitization)
- Sanitization des noms de fichiers (suppression des accents et caractères spéciaux)
- Support: PDF, PNG, JPG, JPEG, WEBP, GIF, SVG

### ✅ Téléchargement de fichiers
- Récupération via URL relative
- MIME type automatique selon l'extension
- Headers HTTP appropriés

### ✅ Suppression de fichiers
- Suppression sécurisée du système de fichiers
- Vérification de l'existence avant suppression

## 🔌 Endpoints API

### 1. Upload un fichier

**Endpoint:** `POST /api/files/upload`

**Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('folder', 'documents'); // 'avatars' ou 'documents'
```

**Réponse (Success):**
```json
{
  "success": true,
  "url": "documents/1732748400000-rapport.pdf",
  "message": "Fichier uploadé avec succès"
}
```

**Réponse (Erreur):**
```json
{
  "error": "Type de fichier invalide. Types autorisés: png, jpg, jpeg, pdf, webp, gif, svg"
}
```

---

### 2. Télécharger un fichier

**Endpoint:** `GET /api/files/:folder/:filename`

**Exemple:**
```
GET /api/files/documents/1732748400000-rapport.pdf
```

**Réponse:** 
- Le fichier brut avec les headers HTTP appropriés
- Content-Type selon l'extension
- Content-Disposition: inline

---

### 3. Supprimer un fichier

**Endpoint:** `DELETE /api/files/:folder/:filename`

**Exemple:**
```
DELETE /api/files/documents/1732748400000-rapport.pdf
```

**Réponse (Success):**
```json
{
  "success": true,
  "message": "Fichier supprimé avec succès"
}
```

**Réponse (Erreur):**
```json
{
  "error": "Fichier non trouvé"
}
```

## 💻 Utilisation en Frontend

### Upload simple avec fetch

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'documents');

  const response = await fetch('http://localhost:3000/api/files/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('URL du fichier:', data.url);
    // Exemple: "documents/1732748400000-mon-fichier.pdf"
  }
};
```

### Afficher une image uploadée

```tsx
const ImagePreview = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <img 
      src={`http://localhost:3000/api/files/${fileUrl}`}
      alt="Preview"
    />
  );
};
```

### Télécharger un fichier

```typescript
const downloadFile = (fileUrl: string) => {
  window.open(`http://localhost:3000/api/files/${fileUrl}`, '_blank');
};
```

### Supprimer un fichier

```typescript
const deleteFile = async (fileUrl: string) => {
  const response = await fetch(`http://localhost:3000/api/files/${fileUrl}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Fichier supprimé');
  }
};
```

## 🧪 Test avec le composant frontend

Un composant de test complet est disponible à l'URL :

```
http://localhost:5173/#/test/file-upload
```

Ce composant permet de :
- ✅ Sélectionner un fichier
- ✅ L'uploader
- ✅ Voir l'URL générée
- ✅ Télécharger/Voir le fichier
- ✅ Supprimer le fichier
- ✅ Preview pour les images

## 🔐 Sécurité

### ✅ Validation stricte des types
Le service utilise `file-type` pour vérifier le **MIME type réel** du fichier, pas juste son extension. Cela empêche l'upload de fichiers malveillants renommés.

```typescript
// ❌ Quelqu'un renomme virus.exe en image.png
// ✅ Le système détecte que ce n'est pas une vraie image et rejette le fichier
```

### ✅ Sanitization des noms de fichiers
Les noms de fichiers sont nettoyés automatiquement :
- Suppression des accents (é → e)
- Remplacement des caractères spéciaux par `_`
- Conversion en minuscules

```typescript
// Avant : "Rapport Financier 2024 (Final).pdf"
// Après : "rapport_financier_2024__final_.pdf"
```

### ✅ Noms uniques avec timestamp
Chaque fichier uploadé reçoit un timestamp pour éviter les collisions :

```typescript
// Format : {timestamp}-{nom-sanitizé}.{extension}
// Exemple : 1732748400000-rapport.pdf
```

## 📊 Stockage dans MongoDB (optionnel)

Si vous voulez stocker les métadonnées des fichiers dans MongoDB, ajoutez un champ `attachments` dans vos modèles :

```typescript
// models/Workflow.model.ts
const workflowSchema = new mongoose.Schema({
  title: String,
  attachments: [{
    name: String,            // Nom original du fichier
    url: String,             // URL relative (ex: "documents/1732748400000-rapport.pdf")
    size: Number,            // Taille en bytes
    mimeType: String,        // Type MIME
    uploadedAt: Date,        // Date d'upload
  }]
});
```

## 🛠️ Configuration

### Variables d'environnement (optionnel)

Si vous voulez configurer le dossier d'upload :

```env
UPLOAD_DIR=/custom/path/to/uploads
```

Par défaut, le dossier est `backend/uploads/`.

## 📝 Types de fichiers supportés

| Type | Extensions | MIME Types |
|------|-----------|------------|
| Images | `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` | `image/png`, `image/jpeg`, `image/webp`, `image/gif` |
| Vectoriel | `.svg` | `image/svg+xml` |
| Documents | `.pdf` | `application/pdf` |

## 🔄 Évolutions possibles

### Option 1 : MongoDB GridFS
Stocker les fichiers directement dans MongoDB au lieu du système de fichiers.

### Option 2 : Azure Blob Storage
Stocker les fichiers sur Azure pour une solution cloud scalable.

### Option 3 : Amazon S3
Stocker les fichiers sur AWS S3.

**Note:** Ces options nécessitent des modifications du `FileService` mais les routes API restent identiques.

## 🐛 Debugging

### Vérifier que le dossier uploads existe

```bash
ls -la backend/uploads/
# Devrait afficher : avatars/ documents/ .gitkeep
```

### Tester l'upload manuellement avec curl

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -F "file=@/path/to/your/file.pdf" \
  -F "folder=documents"
```

### Vérifier les permissions du dossier

```bash
chmod 755 backend/uploads/
chmod 755 backend/uploads/avatars/
chmod 755 backend/uploads/documents/
```

## 🎓 Ressources

- [file-type](https://github.com/sindresorhus/file-type) - Validation des types de fichiers
- [Hono](https://hono.dev/) - Framework web minimaliste
- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) - API pour uploader des fichiers

