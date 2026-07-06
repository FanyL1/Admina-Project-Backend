# Backend - Instrucciones de instalación y puesta en marcha

Este repositorio contiene el backend del proyecto Admina. Este documento explica los requisitos, la instalación, la configuración y los comandos necesarios para levantar la aplicación en desarrollo y producción.

**Requisitos**:
- Node.js >= 18
- npm (v8+) o yarn
- PostgreSQL (local o remoto) o Docker
- Conexión a Internet para descargar dependencias

**Variables de entorno**
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables mínimas:

```
PORT=2560
DATABASE_URL=postgresql://USUARIO:CLAVE@localhost:5432/nombre_de_base
JWT_SECRET=tu_jwt_secreto
# Opcional: ruta absoluta para subir archivos. Si no se define, se usará `src/uploads/documents` por defecto
UPLOAD_PATH=./uploads/documents
```

Reemplaza `USUARIO`, `CLAVE` y `nombre_de_base` por los valores de tu base de datos.

**Instalación (local)**
1. Clona el repositorio y entra en la carpeta del backend:

```bash
git clone <repo-url>
cd repository/Backend
```

2. Instala dependencias:

```bash
npm install
# o
yarn install
```

3. Prepara `.env` (ver sección anterior).

4. Generar el cliente de Prisma y ejecutar migraciones (local/desarrollo):

```bash
npx prisma migrate dev --name init
npx prisma generate
# o para entornos de producción:
npx prisma migrate deploy
```

5. (Opcional) Ejecutar Prisma Studio para explorar la base de datos:

```bash
npx prisma studio
```

**Arrancar la aplicación**
- En desarrollo (con recarga automática):

```bash
npm run dev
```

- En producción:

```bash
npm start
```

Por defecto la app escucha en el `PORT` definido en `.env`.

**Base de datos con Docker (opcional)**
Si no tienes PostgreSQL instalado, puedes levantar uno rápidamente con Docker:

```bash
docker run --name admina-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=adminpass -e POSTGRES_DB=admina -p 5432:5432 -d postgres:15

# Ejemplo de DATABASE_URL para este contenedor:
# postgresql://admin:adminpass@localhost:5432/admina
```

**Scripts y comandos útiles**
- `npm run dev` — inicia con `nodemon` (desarrollo)
- `npm start` — inicia con `node server.js` (producción)
- `npx prisma generate` — genera el cliente de Prisma
- `npx prisma migrate dev` / `npx prisma migrate deploy` — migraciones
- `npx prisma db push` — sincroniza el esquema sin crear migraciones (útil para pruebas rápidas)

**Carga de archivos**
El backend permite subir documentos en formato PDF. Si defines `UPLOAD_PATH`, el middleware guardará los archivos allí; si no, creará una carpeta interna en `src/uploads/documents`.

Límites y tipos aceptados por defecto:
- Tipo: `application/pdf`
- Tamaño máximo por archivo: 5 MB
- Máximo de archivos por subida: 10

**Scripts de generación de datos (opcional)**
El proyecto incluye `src/controllers/generateUsers.js` que crea un fichero `usuarios.json` y hace peticiones a la ruta de registro local. Para usarlo:

```bash
# Desde la raíz del proyecto
node src/controllers/generateUsers.js
```

Nota: el script asume que el servidor está escuchando en `http://localhost:2560`. Ajusta `PORT` si usas otro puerto.

**Depuración y resolución de problemas**
- Si Prisma lanza errores sobre `DATABASE_URL`, verifica que `.env` esté cargado y la URL sea válida.
- Si la aplicación no arranca, revisa los logs en la consola y confirma que las dependencias se instalaron correctamente.
- Para problemas con la subida de archivos, comprueba permisos en `UPLOAD_PATH` y que el directorio exista o se pueda crear.

**Notas de seguridad**
- No subas el `.env` a repositorios públicos.
- Usa valores seguros para `JWT_SECRET` y para las credenciales de la base de datos en entornos de producción.

**Despliegue**
- En producción, usa un proceso gestor (pm2, systemd, docker) y asegúrate de ejecutar `npx prisma migrate deploy` antes de iniciar.
- Si usas Docker, considera crear un `Dockerfile` y `docker-compose.yml` que incluyan la base de datos y la aplicación.

**Contacto y más info**
Revisa la carpeta `src` para ver rutas, controladores y middlewares. Si quieres que incluya un `docker-compose.yml` o un script de `seed` listo para usar, dímelo y lo agrego.

---
