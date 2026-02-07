# CivilTrack

> Bitácora digital para el seguimiento de obras civiles

**Producto de OpenCivil** · Estado: Borrador · Febrero 2026

---

## Resumen

CivilTrack es una plataforma web (enfoque móvil) que sustituye los reportes en papel por una bitácora digital: los residentes capturan evidencia fotográfica desde el campo y los directores consultan el avance desde la oficina. La información queda centralizada y permite generar reportes PDF automáticos.

---

## Objetivo

Digitalizar el reporte diario de obra mediante un MVP que centralice evidencia fotográfica y datos técnicos en una base de datos segura, eliminando el uso de papel y reduciendo el tiempo administrativo del residente.

---

## Funcionalidades del MVP

| Módulo | Descripción |
|--------|-------------|
| Autenticación | Usuarios con roles (Administrador / Residente) |
| Bitácora | Entradas con texto, fotos y evidencia |
| Dashboard | Visualización de reportes en lista o tarjeta |
| Exportación | Generación de reportes en PDF |
| Proyectos | CRUD de obras activas |

---

## Fuera de alcance (Fase 1)

- Chat en tiempo real  
- Nómina, pagos o inventarios  
- Modelado 3D/BIM  
- Sincronización offline compleja  

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

- **Gestión de tareas:** ClickUp (obligatorio)
- **Control de versiones:** Git Flow con ramas `feature/` y PR hacia `main`
- **Definición de terminado:** Código funcional, probado localmente y subido al repositorio
