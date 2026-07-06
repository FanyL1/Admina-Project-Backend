//Para el server
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//Para la documentacion
import swaggerUi from 'swagger-ui-express';
import OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
//Rutas
import apiRoutes from './src/routes/index.js';

// Obtener el directorio actual para que funcione import
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//Middlesware basicos

app.use(cors({
  origin: 'https://admina-project-frontend.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const documentsPath = path.resolve(process.cwd(), 'src', 'uploads', 'documents');
app.use('/uploads/documents', express.static(documentsPath));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Leer el archivo openapi.json
const openApiPath = path.join(__dirname, 'openapi.json');
const apiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));

// Mostrar la interfaz gráfica de Swagger en /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

//Validador de opneapi (se ejecuta antes de las rutas)
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiPath,        // Ruta al archivo openapi.json
    validateRequests: true,      // Validar peticiones entrantes
    validateResponses: false,  
    // Ignorar rutas de documentación y la raíz /api (con o sin barra final)
    ignorePaths: /^\/(favicon\.ico|api-docs)(?:\/|$)|^\/api(?:\/|$)/,
  })
);

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message,
      details: err.errors || []
    });
  }
  
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;