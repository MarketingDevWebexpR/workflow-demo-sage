# Send Email Edge Function

Supabase Edge Function for sending emails via [Resend](https://resend.com) API.

## Endpoint

```
POST /functions/v1/send-email
```

## Request

### Headers

```
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
```

### Body

| Field     | Type                | Required | Description                              |
|-----------|---------------------|----------|------------------------------------------|
| `to`      | `string \| string[]` | Yes      | Recipient email(s)                       |
| `subject` | `string`            | Yes      | Email subject                            |
| `message` | `string`            | Yes      | Plain text email content                 |
| `html`    | `string`            | No       | HTML email content (auto-generated if not provided) |
| `from`    | `string`            | No       | Sender email (uses `DEFAULT_FROM_EMAIL` env var if not provided) |

### Example Request

```json
{
  "to": "recipient@example.com",
  "subject": "Hello from Supabase!",
  "message": "This is a test email sent from a Supabase Edge Function.",
  "html": "<h1>Hello!</h1><p>This is a test email.</p>"
}
```

### Multiple Recipients

```json
{
  "to": ["user1@example.com", "user2@example.com"],
  "subject": "Team Update",
  "message": "Important team announcement..."
}
```

## Response

### Success (200)

```json
{
  "success": true,
  "messageId": "abc123-def456-...",
  "sentAt": "2024-01-15T10:30:00.000Z"
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "to: Invalid email format",
    "subject: Subject is required"
  ]
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Environment Variables

Set these in your Supabase project dashboard under **Settings > Edge Functions**:

| Variable             | Required | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `RESEND_API_KEY`    | Yes      | Your Resend API key (get it at resend.com)       |
| `DEFAULT_FROM_EMAIL`| No       | Default sender email (defaults to `onboarding@resend.dev`) |

## Local Development

### Prerequisites

1. Install [Supabase CLI](https://supabase.com/docs/guides/cli)
2. Install [Deno](https://deno.land/manual/getting_started/installation)

### Setup

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Set secrets locally
supabase secrets set RESEND_API_KEY=re_xxxxx
supabase secrets set DEFAULT_FROM_EMAIL=hello@yourdomain.com
```

### Run Locally

```bash
# Start the function locally
supabase functions serve send-email --env-file ./supabase/.env.local
```

### Test with cURL

```bash
curl -X POST http://localhost:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "Hello from local development!"
  }'
```

## Deployment

```bash
# Deploy the function
supabase functions deploy send-email

# Set production secrets
supabase secrets set RESEND_API_KEY=re_xxxxx --project-ref your-project-ref
```

## Usage from Frontend

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function sendEmail() {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to: 'recipient@example.com',
      subject: 'Hello!',
      message: 'This is a test email.',
    },
  });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Email sent:', data.messageId);
}
```

## Migration from Backend Service

This Edge Function replaces the backend email service at:
- `backend/src/modules/emails/services/email.service.ts`
- `backend/src/modules/emails/actions/send-email.action.ts`

The API contract is identical, so you can update your frontend calls to point to the Edge Function with minimal changes.
