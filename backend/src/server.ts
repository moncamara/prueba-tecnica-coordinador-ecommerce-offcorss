import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { connectDB } from './config/db';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { fetchVtexProducts } from './services/vtexService';
import jwt from 'jsonwebtoken';

dotenv.config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'offcorss_super_secret_key_2026';

async function startServer() {
  const app = express();

  // Middlewares estándar
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  // Conectar a Base de Datos
  await connectDB();

  // Configuración de Apollo Server para GraphQL
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      console.error(' GraphQLError:', formattedError, error);
      return formattedError;
    }
  });

  await server.start();

  // Endpoint GraphQL con contexto de autenticación
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        let userId: string | null = null;

        if (authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            userId = decoded.userId;
          } catch (err) {
            // Token inválido o expirado
          }
        }
        return { userId };
      }
    })
  );

  // Endpoint REST Proxy para la API de Productos VTEX
  app.get('/api/vtex/products', async (req: Request, res: Response) => {
    try {
      const query = typeof req.query.query === 'string' ? req.query.query : undefined;
      const from = parseInt(req.query._from as string) || 0;
      const to = parseInt(req.query._to as string) || 49;

      const products = await fetchVtexProducts(query, from, to);
      return res.json(products);
    } catch (error: any) {
      console.warn('📌 Aviso: Error en consulta de catálogo VTEX, retornando respaldo seguro:', error.message);
      const fallbackProducts = await fetchVtexProducts();
      return res.json(fallbackProducts);
    }
  });

  // Ruta de prueba/estado del servidor
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date(), app: 'OFFCORSS E-commerce Backend' });
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(` Servidor backend escuchando en http://127.0.0.1:${PORT}`);
    console.log(` Servidor GraphQL listo en http://127.0.0.1:${PORT}/graphql`);
    console.log(` Endpoint REST de Productos VTEX en http://127.0.0.1:${PORT}/api/vtex/products`);
  });
}

startServer();
