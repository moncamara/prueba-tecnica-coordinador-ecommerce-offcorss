import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interfaz TypeScript que define los campos de la entidad Usuario.
 */
export interface IUser extends Document {
  username: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  password?: string;
  createdAt: Date;
}

/**
 * Esquema Mongoose para la colección de Usuarios.
 * Cumple con los requerimientos solicitados en la prueba técnica de OFFCORSS.
 */
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    userType: { type: String, required: true, default: 'Coordinador E-commerce' },
    password: { type: String, required: true }
  },
  {
    timestamps: true // Genera automáticamente createdAt y updatedAt
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
