# File Upload Edge Function

Supabase Edge Function for handling file uploads to Supabase Storage.

## Features

- Accepts multipart/form-data file uploads
- Validates file types (PNG, JPG, JPEG, PDF, WEBP, GIF, SVG)
- Sanitizes filenames (removes accents and special characters)
- Adds timestamp prefix for uniqueness
- Uploads to Supabase Storage bucket
- Returns public URL

## Setup

### 1. Create Storage Bucket

In your Supabase Dashboard, create a storage bucket named `uploads` with the following structure:

```
uploads/
  avatars/
  documents/
```

Or via SQL:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');
```

### 2. Deploy the Function

```bash
# From the project root
supabase functions deploy file-upload
```

### 3. Set Environment Variables

The function uses these environment variables (automatically available in Supabase):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for storage operations

## Usage

### Request

```bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/file-upload' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -F 'file=@/path/to/image.png' \
  -F 'folder=avatars'
```

### Parameters

| Field  | Type   | Required | Description                              |
|--------|--------|----------|------------------------------------------|
| file   | File   | Yes      | The file to upload                       |
| folder | string | Yes      | Destination folder: `avatars` or `documents` |

### Response

**Success (200):**

```json
{
  "success": true,
  "url": "https://your-project.supabase.co/storage/v1/object/public/uploads/avatars/1703001234567-image.png",
  "path": "avatars/1703001234567-image.png",
  "filename": "1703001234567-image.png",
  "size": 12345,
  "mimeType": "image/png"
}
```

**Error (4xx/5xx):**

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Error Codes

| Status | Description                                    |
|--------|------------------------------------------------|
| 400    | Invalid request (missing file, invalid folder) |
| 405    | Method not allowed (only POST is accepted)     |
| 500    | Server error (upload failed, config error)     |

## File Validation

### Allowed File Types

- Images: PNG, JPG, JPEG, GIF, WEBP, SVG
- Documents: PDF

### File Size Limit

Maximum file size: **10MB**

### Filename Sanitization

The function sanitizes filenames by:

1. Normalizing unicode characters (NFD decomposition)
2. Removing diacritics (accents)
3. Replacing special characters with underscores
4. Converting to lowercase

Example: `Été 2024 - Photo (1).PNG` becomes `ete_2024_-_photo__1_.png`

## Frontend Integration

### JavaScript/TypeScript

```typescript
async function uploadFile(file: File, folder: 'avatars' | 'documents') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/file-upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.url;
}
```

### React Example

```tsx
function FileUploader() {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, 'avatars');
      console.log('Uploaded:', url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileChange}
      disabled={uploading}
      accept=".png,.jpg,.jpeg,.gif,.webp,.svg,.pdf"
    />
  );
}
```

## Local Development

```bash
# Start Supabase locally
supabase start

# Serve the function locally
supabase functions serve file-upload --no-verify-jwt

# Test with curl
curl -X POST \
  'http://localhost:54321/functions/v1/file-upload' \
  -F 'file=@test-image.png' \
  -F 'folder=avatars'
```
