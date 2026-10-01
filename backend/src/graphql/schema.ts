/**
 * Definición del Esquema GraphQL (TypeDefs).
 * Incluye las consultas (Queries) y mutaciones (Mutations) requeridas para la gestión de usuarios.
 */
export const typeDefs = `#graphql
  # Entidad Usuario con los campos requeridos en la prueba
  type User {
    id: ID!
    username: String!
    name: String!
    lastName: String!
    email: String!
    userType: String!
    createdAt: String!
  }

  # Respuesta de autenticación
  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Obtiene los datos del usuario logueado o por ID
    me(id: ID): User
    # Obtiene todos los usuarios registrados
    users: [User!]!
  }

  type Mutation {
    # Autenticación de usuario
    login(username: String!, password: String!): AuthPayload!

    # Actualización de datos de perfil del usuario en la Base de Datos
    updateUser(
      id: ID!
      name: String
      lastName: String
      email: String
      userType: String
    ): User!
  }
`;
