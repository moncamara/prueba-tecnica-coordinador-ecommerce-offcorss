import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Función para inicializar la conexión con MongoDB.
 * Si MONGODB_URI está configurado, intenta la conexión con timeout de 3s.
 * En caso de no haber servidor MongoDB disponible, la app continúa operando.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/offcorss_db';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(` Conexión exitosa a MongoDB en: ${mongoUri}`);

    // Si la BD está vacía, sembrar usuario inicial automáticamente en MongoDB Atlas
    const User = mongoose.model('User');
    const count = await User.countDocuments();
    if (count === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        name: 'Mónica María',
        lastName: 'Silva Brugés',
        email: 'moncamara@gmail.com',
        userType: 'Coordinador E-commerce',
        password: passwordHash
      });
      console.log(' Usuario admin sembrado exitosamente en MongoDB Cloud.');
    }
  } catch (error) {
    console.log('📌 [MongoDB Config] No se detectó un servidor MongoDB activo localmente.');
    console.log(' Servidor iniciado en MODO DEMO / ALMACENAMIENTO EN MEMORIA para pruebas inmediatas sin fricción.');
  }
};
