/**
 * AI UI Code Generator Edge Function
 * Generates TSX code for Sandpack preview using OpenAI GPT-4o
 * Streaming response via Server-Sent Events (SSE)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// System prompt for TSX code generation
const SYSTEM_PROMPT = `# MISSION
Tu es un expert React/TypeScript qui genere du code TSX de haute qualite pour Sandpack.

# COMPOSANTS DISPONIBLES
Tu as acces a ces composants **DEJA IMPORTES** dans l'environnement Sandpack :

## Composants de base :
- **Button** : \`variant\` (default, outline, destructive, ghost, link), \`size\` (default, sm, lg)
- **Input** : champ texte standard
- **Textarea** : champ multi-lignes
- **Label** : label pour formulaires
- **Badge** : badge/etiquette
- **Card, CardHeader, CardTitle, CardContent, CardFooter** : composants de carte

## Composants avances :
- **Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter** : modale
- **Switch** : toggle on/off
- **Separator** : ligne de separation
- **Tabs, TabsList, TabsTrigger, TabsContent** : onglets

# FORMAT DE REPONSE
Tu dois UNIQUEMENT retourner le code TSX qui sera place dans \`/App.tsx\`.

**REGLES CRITIQUES** :
1. Commence TOUJOURS par les imports React + composants necessaires
2. Export une fonction \`export default function App()\`
3. Utilise React.useState pour l'etat
4. Code TSX propre, type, fonctionnel
5. Utilise les composants disponibles (pas de HTML brut sauf pour layout)
6. Ajoute des styles inline quand necessaire
7. PAS de markdown, PAS d'explication, UNIQUEMENT le code
8. PAS de \`\`\`tsx au debut/fin

# TEMPLATE DE BASE
\`\`\`tsx
import React from 'react';
import { Button } from './components/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/Card';
import './styles.css';

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <CardHeader>
          <CardTitle>Mon Titre</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Compteur: {count}</p>
          <Button onClick={() => setCount(count + 1)}>
            Incrementer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
\`\`\`

# BONNES PRATIQUES
- Utilise \`React.useState\` pour l'etat local
- Wrap le contenu principal dans une \`<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>\`
- Utilise Card pour structurer visuellement
- Utilise Dialog pour les interactions modales
- Ajoute des styles inline pour le spacing (\`marginBottom\`, \`gap\`, etc.)
- Code clean, bien indente, facile a lire

# INSTRUCTIONS FINALES
- Analyse la demande de l'utilisateur
- Choisis les composants appropries
- Genere du code TSX propre et fonctionnel
- RETOURNE UNIQUEMENT LE CODE, sans markdown ni explication
- Le code doit etre pret a etre copie-colle dans App.tsx`;

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const { message, history = [], viewContext } = await req.json();

        if (!message) {
            return new Response(JSON.stringify({ error: "Message requis" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const MAX_MESSAGE_LENGTH = 10000;
        if (message.length > MAX_MESSAGE_LENGTH) {
            return new Response(
                JSON.stringify({
                    error: "Message trop long",
                    details: `Le message ne doit pas depasser ${MAX_MESSAGE_LENGTH} caracteres`,
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const apiKey = Deno.env.get("OPENAI_API_KEY");

        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error: "OPENAI_API_KEY non configuree",
                    hint: "Configurez OPENAI_API_KEY dans les secrets Supabase",
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        console.log("AI UI Code request:", {
            messageLength: message.length,
            historyLength: history.length,
            stepId: viewContext?.stepId,
        });

        // Build messages array for OpenAI
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            { role: "system", content: SYSTEM_PROMPT },
        ];

        // Add history
        if (history && history.length > 0) {
            for (const msg of history) {
                if (msg.role === "user" || msg.role === "assistant") {
                    messages.push({
                        role: msg.role,
                        content: msg.content,
                    });
                }
            }
        }

        // Add current message
        messages.push({ role: "user", content: message });

        // Call OpenAI API with streaming
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages,
                max_tokens: 4000,
                temperature: 0.7,
                stream: true,
            }),
        });

        if (!openaiResponse.ok) {
            const error = await openaiResponse.json();
            console.error("OpenAI error:", error);
            return new Response(
                JSON.stringify({
                    error: "Erreur lors de l'appel a OpenAI",
                    details: error,
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Create SSE stream
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        // Process OpenAI stream in background
        (async () => {
            let accumulatedContent = "";

            try {
                if (!openaiResponse.body) {
                    throw new Error("No body in OpenAI response");
                }

                const reader = openaiResponse.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        // Send final message
                        await writer.write(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "done",
                                    fullContent: accumulatedContent,
                                })}\n\n`
                            )
                        );
                        break;
                    }

                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);

                            if (data === "[DONE]") {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content;

                                if (content) {
                                    accumulatedContent += content;

                                    await writer.write(
                                        encoder.encode(
                                            `data: ${JSON.stringify({
                                                type: "chunk",
                                                content: content,
                                            })}\n\n`
                                        )
                                    );
                                }
                            } catch {
                                // Ignore parsing errors
                            }
                        }
                    }
                }

                await writer.close();
            } catch (error) {
                console.error("Streaming error:", error);

                await writer.write(
                    encoder.encode(
                        `data: ${JSON.stringify({
                            type: "error",
                            error: error instanceof Error ? error.message : "Unknown error",
                        })}\n\n`
                    )
                );
                await writer.close();
            }
        })();

        return new Response(readable, {
            headers: {
                ...corsHeaders,
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Request error:", error);
        return new Response(
            JSON.stringify({
                error: "Erreur interne",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
