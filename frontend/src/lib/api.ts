/**
 * Configuration API centralisee pour le frontend
 * Utilise Supabase directement pour les donnees, Edge Functions pour l'IA
 */

import { SUPABASE_FUNCTIONS_URL } from './supabase';

// URL de base de l'API backend (deprecated - kept for reference)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// URL de base pour les endpoints workflows (deprecated - use Supabase client directly)
export const API_WORKFLOWS_URL = `${API_URL}/api/workflows`

// URL de base pour les endpoints AI (Supabase Edge Functions)
export const API_AI_URL = SUPABASE_FUNCTIONS_URL

// Specific Edge Function endpoints
export const AI_CHAT_URL = `${SUPABASE_FUNCTIONS_URL}/ai-chat`
export const AI_UI_CHAT_URL = `${SUPABASE_FUNCTIONS_URL}/ai-ui-chat`
export const AI_UI_CODE_URL = `${SUPABASE_FUNCTIONS_URL}/ai-ui-code`

/**
 * Fonction utilitaire pour effectuer des requetes API avec les headers par defaut
 * @param endpoint - Le chemin de l'endpoint (ex: '/api/workflows')
 * @param options - Options fetch additionnelles
 * @returns La reponse fetch
 */
export async function apiRequest(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  return response
}

/**
 * Fonction utilitaire pour les requetes GET
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint)

  if (!response.ok) {
    throw new Error(`API GET error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fonction utilitaire pour les requetes POST
 */
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API POST error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fonction utilitaire pour les requetes PUT
 */
export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API PUT error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fonction utilitaire pour les requetes DELETE
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`API DELETE error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
