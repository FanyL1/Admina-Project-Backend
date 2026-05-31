//Server
import app from './app.js'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://192.168.1.110:${PORT}/api`);
  console.log(`Documentación Swagger: http://192.168.1.110:${PORT}/api-docs`);
});