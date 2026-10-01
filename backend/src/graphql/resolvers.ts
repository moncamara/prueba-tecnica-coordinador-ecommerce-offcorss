import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'offcorss_super_secret_key_2026';

// Usuario por defecto en memoria (Respaldo en caso de que MongoDB local no esté corriendo)
let inMemoryUser = {
  id: 'usr_654321',
  username: 'admin',
  name: 'Mónica María',
  lastName: 'Silva Brugés',
  email: 'moncamara@gmail.com',
  userType: 'Coordinador E-commerce',
  passwordHash: bcrypt.hashSync('admin123', 10),
  createdAt: new Date().toISOString()
};

/**
 * Resolvers de GraphQL para procesar las consultas y mutaciones de usuario.
 * Soporta almacenamiento en MongoDB con respaldo automático en memoria.
 */
export const resolvers = {
  Query: {
    me: async (_: any, { id }: { id?: string }, context: any) => {
      const targetId = id || context.userId;

      // Intentar consultar Mongoose si la conexión está activa
      if (mongoose.connection.readyState === 1) {
        if (!targetId) {
          const firstUser = await User.findOne();
          return firstUser || formatInMemoryUser();
        }
        const user = await User.findById(targetId);
        if (user) return user;
      }

      // Respaldo en memoria
      return formatInMemoryUser();
    },

    users: async () => {
      if (mongoose.connection.readyState === 1) {
        const users = await User.find().sort({ createdAt: -1 });
        if (users.length > 0) return users;
      }
      return [formatInMemoryUser()];
    }
  },

  Mutation: {
    // Proceso de Login
    login: async (_: any, { username, password }: any) => {
      try {
        const cleanUsername = (username || '').trim();
        let foundUser: any = null;

        if (mongoose.connection.readyState === 1) {
          try {
            foundUser = await User.findOne({ username: cleanUsername });
          } catch (dbErr) {
            console.warn('📌 Aviso: Mongoose no pudo consultar la BD, usando usuario en memoria.');
          }
        }

        // Si no existe en DB o no hay conexión, verificar contra usuario en memoria
        if (!foundUser) {
          if (cleanUsername === inMemoryUser.username) {
            const isValid = await bcrypt.compare(password, inMemoryUser.passwordHash);
            if (!isValid) {
              throw new Error('Credenciales inválidas. Contraseña incorrecta.');
            }
            const token = jwt.sign(
              { userId: inMemoryUser.id, username: inMemoryUser.username, email: inMemoryUser.email },
              JWT_SECRET,
              { expiresIn: '24h' }
            );
            return { token, user: formatInMemoryUser() };
          }
          throw new Error('Credenciales inválidas. Usuario no encontrado.');
        }

        const isValidPassword = await bcrypt.compare(password, foundUser.password || '');
        if (!isValidPassword) {
          throw new Error('Credenciales inválidas. Contraseña incorrecta.');
        }

        const token = jwt.sign(
          { userId: foundUser._id, username: foundUser.username, email: foundUser.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return { token, user: foundUser };
      } catch (err: any) {
        console.error(' Error en resolver login:', err);
        throw err;
      }
    },

    // Mutación para editar y actualizar datos del usuario en la BD
    updateUser: async (_: any, { id, name, lastName, email, userType }: any) => {
      if (mongoose.connection.readyState === 1) {
        const user = await User.findById(id);
        if (user) {
          if (name !== undefined) user.name = name;
          if (lastName !== undefined) user.lastName = lastName;
          if (email !== undefined) user.email = email;
          if (userType !== undefined) user.userType = userType;

          await user.save();
          return user;
        }
      }

      // Actualizar en memoria si no está en Mongoose
      if (name !== undefined) inMemoryUser.name = name;
      if (lastName !== undefined) inMemoryUser.lastName = lastName;
      if (email !== undefined) inMemoryUser.email = email;
      if (userType !== undefined) inMemoryUser.userType = userType;

      return formatInMemoryUser();
    }
  }
};

function formatInMemoryUser() {
  return {
    id: inMemoryUser.id,
    username: inMemoryUser.username,
    name: inMemoryUser.name,
    lastName: inMemoryUser.lastName,
    email: inMemoryUser.email,
    userType: inMemoryUser.userType,
    createdAt: inMemoryUser.createdAt
  };
}
