import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * CORS headers for cross-origin requests
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Allowed file types with their MIME types
 */
const ALLOWED_TYPES: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/gif": ["gif"],
  "image/webp": ["webp"],
  "image/svg+xml": ["svg"],
  "application/pdf": ["pdf"],
};

/**
 * Valid folder destinations
 */
const VALID_FOLDERS = ["avatars", "documents"] as const;
type ValidFolder = (typeof VALID_FOLDERS)[number];

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Sanitizes a filename by removing accents and special characters
 * @param name - The original filename
 * @returns The sanitized filename
 */
function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD") // Decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special chars with _
    .toLowerCase();
}

/**
 * Validates if the file type is allowed
 * @param mimeType - The MIME type of the file
 * @returns True if the file type is allowed
 */
function isValidFileType(mimeType: string): boolean {
  return Object.keys(ALLOWED_TYPES).includes(mimeType);
}

/**
 * Gets the file extension from MIME type
 * @param mimeType - The MIME type
 * @returns The file extension
 */
function getExtensionFromMimeType(mimeType: string): string {
  const extensions = ALLOWED_TYPES[mimeType];
  return extensions ? extensions[0] : "";
}

/**
 * Validates if the folder is valid
 * @param folder - The folder name
 * @returns True if the folder is valid
 */
function isValidFolder(folder: string): folder is ValidFolder {
  return VALID_FOLDERS.includes(folder as ValidFolder);
}

/**
 * Creates a JSON response with CORS headers
 */
function jsonResponse(
  data: Record<string, unknown>,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Creates an error response
 */
function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ success: false, error: message }, status);
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST method
  if (req.method !== "POST") {
    return errorResponse("Method not allowed. Use POST.", 405);
  }

  try {
    // Verify content type is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return errorResponse(
        "Invalid content type. Expected multipart/form-data."
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    // Validate file presence
    if (!file || !(file instanceof File)) {
      return errorResponse("No file provided. Include a 'file' field.");
    }

    // Validate folder
    if (!folder || typeof folder !== "string") {
      return errorResponse(
        "No folder provided. Include a 'folder' field (avatars or documents)."
      );
    }

    if (!isValidFolder(folder)) {
      return errorResponse(
        `Invalid folder. Allowed folders: ${VALID_FOLDERS.join(", ")}`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      );
    }

    // Validate file type
    if (!isValidFileType(file.type)) {
      const allowedExtensions = Object.values(ALLOWED_TYPES).flat();
      return errorResponse(
        `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`
      );
    }

    // Generate unique filename with timestamp prefix
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const extension = getExtensionFromMimeType(file.type);

    // Ensure the filename has the correct extension
    let finalFilename: string;
    if (sanitizedName.endsWith(`.${extension}`)) {
      finalFilename = `${timestamp}-${sanitizedName}`;
    } else {
      // Remove any existing extension and add the correct one
      const nameWithoutExt = sanitizedName.replace(/\.[^/.]+$/, "");
      finalFilename = `${timestamp}-${nameWithoutExt}.${extension}`;
    }

    const storagePath = `${folder}/${finalFilename}`;

    // Initialize Supabase client with service role key for storage operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing Supabase environment variables");
      return errorResponse("Server configuration error.", 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get file buffer for upload
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    // Note: The bucket name should match your Supabase Storage bucket
    const bucketName = "uploads";

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error("Storage upload error:", error);
      return errorResponse(`Upload failed: ${error.message}`, 500);
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

    return jsonResponse({
      success: true,
      url: publicUrl,
      path: storagePath,
      filename: finalFilename,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return errorResponse(message, 500);
  }
});
