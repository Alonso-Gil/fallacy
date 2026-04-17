# Fallacy

Plataforma de debates: salas con reglas, participantes y espectadores. Este repositorio es un **monorepo** gestionado con **Yarn workspaces** y **Turborepo**.

## Contenido del repositorio

| Ruta             | Descripción                                       |
| ---------------- | ------------------------------------------------- |
| `apps/next`      | Frontend **Next.js** (`fallacy-web`)              |
| `apps/nest`      | API **NestJS** (`fallacy-nest`)                   |
| `packages/types` | Tipos e interfaces compartidos (`@fallacy/types`) |

## Requisitos previos

- **Node.js** 22 (recomendado usar [nvm](https://github.com/nvm-sh/nvm) o similar; en la raíz hay un archivo `.nvmrc`).
- **Yarn** 1.x (el proyecto declara `packageManager: yarn@1.22.19`).

## Cómo levantar el proyecto

1. **Clonar** el repositorio e ir a la carpeta raíz.

2. **Instalar dependencias** (desde la raíz del monorepo):

   ```bash
   yarn install
   ```

3. **Variables de entorno (app web)**  
   En `apps/next`, copia la plantilla y rellena los valores (por ejemplo credenciales de Supabase):

   ```bash
   cp apps/next/.env.template apps/next/.env.local
   ```

   Edita `apps/next/.env.local` y asigna `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` según tu proyecto.

4. **Arrancar en desarrollo**  
   Desde la **raíz**:

   ```bash
   yarn dev
   ```

   Eso levanta la aplicación Next en modo desarrollo (por defecto en [http://localhost:3000](http://localhost:3000), salvo que el puerto esté ocupado).

   Alternativa si necesitas compilar paquetes compartidos antes:

   ```bash
   yarn start:next
   ```

5. **API Nest (opcional)**  
   Si trabajas en el backend:

   ```bash
   yarn workspace fallacy-nest start:dev
   ```

## Scripts útiles (raíz)

| Comando                             | Uso                                     |
| ----------------------------------- | --------------------------------------- |
| `yarn dev`                          | Desarrollo del frontend Next            |
| `yarn compile`                      | Compilación vía Turborepo               |
| `yarn check-types`                  | Comprobación de tipos en los workspaces |
| `yarn lint` / `yarn lint:ci`        | ESLint                                  |
| `yarn format` / `yarn check-format` | Prettier                                |

Tras `yarn install`, el hook **Husky** (`prepare`) configura el **pre-commit** con **lint-staged** (formato y lint sobre archivos staged).

## Integración continua

En GitHub, el workflow `.github/workflows/ci.yml` ejecuta comprobaciones de formato, compilación, tipos y lint en pushes y pull requests hacia `main`.

## Contribuir

Flujo de ramas, PR y buenas prácticas: **[CONTRIBUTING.md](./CONTRIBUTING.md)**.
