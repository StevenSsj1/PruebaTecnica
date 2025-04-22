# Prueba Técnica

## Descripción
Esta es una aplicación desarrollada como parte de una prueba técnica. La aplicación contiene un backend desarrollado en TypeScript con NestJS y Prisma, así como un frontend construido con Next.js.

## Estructura del Proyecto
- **Backend**: Contiene la lógica del servidor, configuraciones de Prisma y migraciones.
- **Frontend**: Una aplicación Next.js que sirve la interfaz de usuario.

## Requisitos
- **Docker** y **Docker Compose** instalados en tu máquina.
- **Node.js** (opcional si deseas ejecutar el proyecto localmente sin Docker).

## Instalación y Ejecución
### Con Docker Compose
1. Construye y levanta los servicios:
   ```bash
   docker-compose up --build
   ```
4. La aplicación estará disponible en:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3002`

### Sin Docker
#### Backend
1. Instala las dependencias:
   ```bash
   cd backend
   npm install
   ```

2. Aplica las migraciones:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Inicia el servidor:
   ```bash
   npm run start:dev
   ```

El backend estará disponible en `http://localhost:3002`.

#### Frontend
1. Instala las dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Inicia el servidor:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:3000`.

## Migraciones y Seed
- **Migraciones**: Prisma se utiliza para manejar las migraciones de la base de datos. Para aplicarlas, utiliza:
  ```bash
  npx prisma migrate dev --name init
  ```
- **Seed**: Para poblar la base de datos con datos iniciales, ejecuta:
  ```bash
  npx prisma db seed
  ```

## Variables de Entorno
Asegúrate de crear un archivo `.env` basado en `.env.example`. Este archivo debe incluir configuraciones como:

```
DATABASE_URL=postgresql://root:root@localhost:5432/postgres?schema=public
JWT_SECRET=supersecreto
```

## Tecnologías Utilizadas
- **Backend**: TypeScript, NestJS, Prisma, PostgreSQL
- **Frontend**: Next.js, React, TailwindCSS
- **Otros**: Docker, Docker Compose

## Cualquier Aclaración Relevante
- Asegúrate de que los puertos 3000(frontend) y 3002(backend) estén libres en tu máquina antes de ejecutar la aplicación.
- El backend y frontend están configurados para comunicarse a través de Docker Compose.

