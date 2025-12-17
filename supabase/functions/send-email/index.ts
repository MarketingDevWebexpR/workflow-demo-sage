import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// ============================================================
// CORS Configuration
// ============================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ============================================================
// Validation Schemas
// ============================================================

/**
 * Schema for validating email request payload
 * - to: Single email or array of emails
 * - subject: Email subject (required)
 * - message: Plain text content (required)
 * - html: HTML content (optional, defaults to wrapped message)
 * - from: Sender email (optional, uses env default)
 */
const SendEmailRequestSchema = z.object({
  to: z.union([
    z.string().email("Invalid email format"),
    z
      .array(z.string().email("Invalid email format in array"))
      .min(1, "At least one recipient required"),
  ]),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  html: z.string().optional(),
  from: z.string().email("Invalid sender email format").optional(),
});

type SendEmailRequest = z.infer<typeof SendEmailRequestSchema>;

/**
 * Response schema for email sending result
 */
interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  sentAt?: string;
  error?: string;
  details?: string[];
}

// ============================================================
// Resend API Integration
// ============================================================

/**
 * Send email via Resend API
 *
 * @param params - Validated email parameters
 * @returns SendEmailResponse with success status and details
 */
async function sendEmailViaResend(
  params: SendEmailRequest
): Promise<SendEmailResponse> {
  const apiKey = Deno.env.get("RESEND_API_KEY");

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return {
      success: false,
      error: "Email service is not configured",
    };
  }

  const defaultFromEmail =
    Deno.env.get("DEFAULT_FROM_EMAIL") || "onboarding@resend.dev";
  const fromEmail = params.from || defaultFromEmail;

  // Normalize recipients to array
  const recipients = Array.isArray(params.to) ? params.to : [params.to];

  // Generate HTML if not provided
  const htmlContent = params.html || `<p>${escapeHtml(params.message)}</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject: params.subject,
        text: params.message,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return {
        success: false,
        error: data.message || data.error || `Resend API error: ${response.status}`,
      };
    }

    console.log("Email sent successfully:", data.id);
    return {
      success: true,
      messageId: data.id,
      sentAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// ============================================================
// Response Helpers
// ============================================================

/**
 * Create JSON response with CORS headers
 */
function jsonResponse(data: SendEmailResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// ============================================================
// Main Handler
// ============================================================

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed. Use POST." },
      405
    );
  }

  try {
    // Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        { success: false, error: "Invalid JSON in request body" },
        400
      );
    }

    // Validate request payload
    const validationResult = SendEmailRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      );
      return jsonResponse(
        { success: false, error: "Validation failed", details: errors },
        400
      );
    }

    // Send email via Resend
    const result = await sendEmailViaResend(validationResult.data);

    // Return appropriate status based on result
    const status = result.success ? 200 : 500;
    return jsonResponse(result, status);
  } catch (error) {
    console.error("Unexpected error in handler:", error);
    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      500
    );
  }
});
