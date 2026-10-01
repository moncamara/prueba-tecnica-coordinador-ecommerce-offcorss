import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';

dotenv.config();

/**
 * Script de inicialización de datos (Seeding).
 * Crea el usuario inicial para las pruebas de inicio de sesión.
 */
async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/offcorss_db';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(' Conectado a MongoDB para la siembra de datos iniciales...');

    // Limpiar usuarios anteriores de prueba si existen
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const defaultUser = new User({
      username: 'admin',
      name: 'Mónica María',
      lastName: 'Silva Brugés',
      email: 'moncamara@gmail.com',
      userType: 'Coordinador E-commerce',
      password: hashedPassword
    });

    await defaultUser.save();
    console.log(' Usuario de prueba creado exitosamente en MongoDB:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('   - Email: moncamara@gmail.com');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('📌 [Seed Script] No se detectó servidor MongoDB local en puerto 27017.');
    console.log(' Nota: La aplicación cuenta con usuario demo en memoria (admin / admin123) por defecto.');
    process.exit(0);
  }
}

seedDatabase();
