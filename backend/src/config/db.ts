import mongoose from 'mongoose';

/**
 * Función para inicializar la conexión con MongoDB.
 * Si MONGODB_URI está configurado, intenta la conexión con timeout de 3s.
 * En caso de no haber servidor MongoDB disponible, la app continúa operando.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/offcorss_db';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(` Conexión exitosa a MongoDB en: ${mongoUri}`);
  } catch (error) {
    console.log('📌 [MongoDB Config] No se detectó un servidor MongoDB activo localmente.');
    console.log(' Servidor iniciado en MODO DEMO / ALMACENAMIENTO EN MEMORIA para pruebas inmediatas sin fricción.');
  }
};
