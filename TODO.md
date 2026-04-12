# Tareas pendientes

## Funcionalidades por implementar

- Quitar el "Prueba" en los layouts de auth
- Terminar el sign up
- Agregar el Provider de auth para google
- Agregar el Provider de auth para email
- Estandarizar estilos
- Validar campos para email

## Correcciones y mejoras

## Otras tareas

- **Migrar a Yarn 4+ (Berry)** y, una vez el árbol de dependencias instale bien con el nuevo lockfile, **eliminar el bloque `resolutions`** en el `package.json` raíz (`es-iterator-helpers` / `internal-slot`), que solo mitiga un conflicto de versiones transitivas con **Yarn Classic** y ESLint/Next. Revisar que `yarn lint:ci` siga pasando en CI (Node 22) tras quitar `resolutions`.
