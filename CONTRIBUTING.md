# Contribuir a Fallacy

## Rama principal

- **`main`** está protegida: los cambios entran solo mediante **pull request** (PR), no con push directo.

## Flujo habitual

1. Crear una rama desde `main` actualizada:  
   `git checkout main && git pull && git checkout -b feature/nombre-corto`
2. Commits con mensajes claros (presente o imperativo, en el idioma que acordéis).
3. Abrir un PR hacia **`main`**.
4. Pasar revisión y comprobaciones acordadas (CI, lint, tipos).
5. **Merge a `main`**: lo hace la persona con permiso (mantenedor), según las reglas del repo en GitHub.

## Nombres de rama (sugerencia)

- `feature/…` — nueva funcionalidad  
- `fix/…` — corrección  
- `chore/…` — tareas de mantenimiento  

## Antes de abrir un PR

- Sin secretos en el código (usar `.env.local` y variables de entorno en el despliegue).
- En este monorepo suele usarse: `yarn compile`, `yarn check-types`, `yarn lint` desde la raíz (y build de la app que toquéis).

## CODEOWNERS

El archivo `.github/CODEOWNERS` define quién debe revisar los PR. Ajustad el usuario listado al mantenedor del proyecto.

Para más detalle sobre cómo proteger `main` en GitHub (aprobaciones, merges, permisos), seguid la guía interna del equipo o la documentación de GitHub sobre *branch protection* y *rulesets*.
