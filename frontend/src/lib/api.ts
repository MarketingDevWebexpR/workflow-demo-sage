/**
 * Configuration API centralisee pour le frontend
 * Utilise les variables d'environnement Vite pour la configuration
 */

// URL de base de l'API backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// URL de base pour les endpoints workflows
export const API_WORKFLOWS_URL = `${API_URL}/api/workflows`

// URL de base pour les endpoints AI
export const API_AI_URL = `${API_URL}/api/ai`

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
