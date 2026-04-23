# CivilTrack

> Bitácora digital para el seguimiento de obras civiles

**Producto de OpenCivil** · Estado: MVP en desarrollo · Abril 2026

---

## Resumen

CivilTrack es una plataforma web **mobile-first** que sustituye los reportes en papel por una bitácora digital: los residentes capturan evidencia fotográfica desde el campo y los directores consultan el avance desde la oficina. La información queda centralizada y permite generar reportes PDF automáticos.

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | React 19 + Vite 7 |
| Estilos | Tailwind CSS v4 |
| Routing | React Router v7 |
| HTTP | Fetch API (`credentials: 'include'`) + Axios (uploads) |
| Íconos | lucide-react |
| Estado | `useState` local + prop drilling |

---

## Funcionalidades implementadas

### Autenticación
- Login con correo y contraseña (sesión por cookie)
- Validación de formato de correo en el cliente
- Persistencia de sesión en `sessionStorage`
- Logout desde el menú lateral

### Proyectos
- Listado de proyectos en tarjetas (grid responsive)
- Crear, editar y eliminar proyecto con modales dedicados
- Estado visual Activo / Inactivo por proyecto
- Metadata: ubicación, fecha de inicio
- Estados vacíos con ilustración cuando no hay proyectos

### Bitácora (ProjectDetail)
- Timeline vertical con reportes del proyecto
- Visualización de foto, fecha, autor, título y descripción por reporte
- Creación de nuevos reportes con foto desde el modal

### Experiencia móvil
- Diseño mobile-first con safe-area de iOS (`env(safe-area-inset-*)`)
- Barra inferior flotante en móvil (FAB / bottom nav)
- Botones con target mínimo de 44–52 px
- Drawer lateral animado (`slide-in-right`) con perfil de usuario
- Modales con `slide-up` animation
- Prevención de auto-zoom en iOS (font-size ≥ 16 px en inputs)

### Modo oscuro
- Toggle en el menú hamburguesa con pill animado y íconos Sol/Luna
- Preferencia persistida en `localStorage` (`civiltrack_theme`)
- Respeta `prefers-color-scheme` del sistema en la primera visita
- Cobertura completa: Dashboard, ProjectDetail, Login, Drawer, modales

---

## Fuera de alcance (Fase 1)

- Chat en tiempo real
- Nómina, pagos o inventarios
- Modelado 3D/BIM
- Sincronización offline compleja
- Exportación a PDF (planeada para Fase 2)

---

## Comandos

```bash
npm run dev       # Servidor de desarrollo en http://localhost:5173
npm run build     # Build de producción en /dist
npm run lint      # Revisión con ESLint
npm run preview   # Preview del build de producción
```

El proxy de Vite reescribe `/api` → `http://localhost:3000` (backend local).

---

## Equipo

| Rol | Funciones principales |
|-----|------------------------|
| **Product Manager** | Definición de requerimientos, prioridades y validación de entregables |
| **Frontend Developer** | UI responsive, consumo de API y manejo de estado |
| **Backend Developer** | API REST, autenticación (JWT), lógica de negocio y documentación |
| **Database Architect** | Diseño del modelo de datos, scripts DDL y optimización de consultas |

---

## Metodología

- **Gestión de tareas:** ClickUp
- **Control de versiones:** Git Flow con ramas `feature/` y PR hacia `main`
- **Definición de terminado:** Código funcional, probado localmente y subido al repositorio
