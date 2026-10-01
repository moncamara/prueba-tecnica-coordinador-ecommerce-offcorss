import { User, Product } from '../types';

// ── URL del Backend ──
// Producción: Apunta al backend desplegado en Render
const RENDER_BACKEND_URL = 'https://offcorss-backend.onrender.com';

const getBackendUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Desarrollo local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://127.0.0.1:4000';
    }
    // Producción (GitHub Pages → Render)
    return RENDER_BACKEND_URL;
  }
  return '';
};

const BASE_BACKEND_URL = getBackendUrl();

/**
 * Función auxiliar para realizar peticiones HTTP GraphQL.
 */
async function fetchGraphQL(query: string, variables: Record<string, any> = {}, token?: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_BACKEND_URL}/graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });

  const text = await response.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(`Error de comunicación con el servidor (${response.status}): ${text || 'Respuesta vacía'}`);
  }

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

/**
 * Petición GraphQL para autenticación de usuario.
 */
export async function loginApi(username: string, password: string): Promise<{ token: string; user: User }> {
  const mutation = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        user {
          id
          username
          name
          lastName
          email
          userType
          createdAt
        }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { username, password });
  return data.login;
}

/**
 * Petición GraphQL para actualizar datos del perfil de usuario en MongoDB.
 */
export async function updateUserApi(
  id: string,
  updates: { name?: string; lastName?: string; email?: string; userType?: string },
  token?: string | null
): Promise<User> {
  const mutation = `
    mutation UpdateUser($id: ID!, $name: String, $lastName: String, $email: String, $userType: String) {
      updateUser(id: $id, name: $name, lastName: $lastName, email: $email, userType: $userType) {
        id
        username
        name
        lastName
        email
        userType
        createdAt
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { id, ...updates }, token);
  return data.updateUser;
}

/**
 * Petición REST para obtener el catálogo de productos de VTEX.
 */
export async function fetchProductsApi(query: string = ''): Promise<Product[]> {
  const queryParam = query ? `?query=${encodeURIComponent(query)}` : '';
  const url = `${BASE_BACKEND_URL}/api/vtex/products${queryParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al conectar con la API de productos de VTEX');
  }
  return await response.json();
}
