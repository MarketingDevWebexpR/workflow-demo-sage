# AI Chat Edge Function

Supabase Edge Function for AI-powered workflow generation using OpenAI GPT-4o-mini with streaming responses.

## Features

- **Streaming SSE Responses**: Real-time streaming using Server-Sent Events
- **Workflow Generation**: Generates XML-based workflow definitions from natural language
- **Conversation History**: Maintains context across multiple messages
- **Workflow Context**: Can modify existing workflows based on context
- **Input Validation**: Protects against oversized inputs

## API Endpoint

**POST** `/functions/v1/ai-chat`

### Request Body

```json
{
  "message": "Create a workflow to send welcome emails to new users",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ],
  "workflowContext": {
    "title": "My Workflow",
    "workflowId": "uuid-here",
    "isEnabled": true,
    "description": "Workflow description",
    "workflowXml": "<workflow>...</workflow>",
    "preferences": "{...}"
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The user's message/prompt |
| `history` | array | No | Previous conversation messages |
| `workflowContext` | object | No | Current workflow state for modifications |

### Response

The response is a Server-Sent Events (SSE) stream with the following event types:

```typescript
// Chunk event - streamed content
{ "type": "chunk", "content": "text fragment" }

// Done event - stream complete
{ "type": "done", "data": "{...}" } // JSON string or null

// Error event
{ "type": "error", "error": "Error message" }
```

### Workflow JSON Structure

When a workflow is generated, the response includes a JSON object after `---WORKFLOW_JSON---`:

```json
{
  "title": "Workflow Title",
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
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) |

## Deployment

### Set the OpenAI API Key Secret

```bash
supabase secrets set OPENAI_API_KEY=sk-your-api-key
```

### Deploy the Function

```bash
supabase functions deploy ai-chat
```

### Local Development

```bash
# Start local Supabase
supabase start

# Serve the function locally
supabase functions serve ai-chat --env-file ./supabase/functions/.env
```

## Usage Example

### Frontend (TypeScript)

```typescript
async function chat(message: string, history: ChatMessage[]) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/ai-chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ message, history }),
    }
  );

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = '';

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.substring(6));

        if (data.type === 'chunk') {
          accumulatedText += data.content;
          // Update UI with streaming text
        } else if (data.type === 'done' && data.data) {
          const workflow = JSON.parse(data.data);
          // Handle workflow JSON
        }
      }
    }
  }
}
```

## Limits

| Limit | Value |
|-------|-------|
| Max message length | 10,000 characters |
| Max workflow XML length | 50,000 characters |
| Max history messages | 15 messages |
| Max tokens (response) | 15,000 tokens |

## Error Responses

| Status | Error |
|--------|-------|
| 400 | Message required or too long |
| 400 | Workflow XML too large |
| 405 | Method not allowed (use POST) |
| 500 | OpenAI API key not configured |
| 500 | OpenAI API error |
