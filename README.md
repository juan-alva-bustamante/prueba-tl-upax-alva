# Administrador de Solicitudes

## ¿Qué es?

Módulo para **crear, asignar, comentar y decidir (aprobar/denegar)** solicitudes, con notificaciones y auditoría.  
Arquitectura **DDD** con **Oracle** como sistema de registro y **MongoDB** como proyección de lectura.

## Estructura sugerida del repo

```
/diagrams
  ├─ diagrama_componentes.drawio
  ├─ ddd_bounded_contexts.drawio
  ├─ ddd_domains.drawio
  ├─ erd_bd_simple.drawio
/docs
  ├─ openapi-requests.yaml
/sql
  ├─ oracle_schema_simple.sql
/mongo
  ├─ mongo_schema_simple.js
/artefactos
  └─ Prueba_Admin_Solicitudes_TL_Solucion.pptx
```

## DDD

- **Bounded Contexts**:
  - **Solicitudes (Core)** — valor principal.
  - **Notificaciones / Observabilidad (Supporting)**.
  - **Identidad/Accesos (Genérico)** vía OHS + ACL (Cognito).
- **Integración**: eventos (EventBridge) → Notificaciones y Observabilidad (_Published Language_).

## API (OpenAPI)

- Contratos: `docs/openapi-requests.yaml`  
  Endpoints clave:  
  `POST /requests`, `POST /requests/{id}/assign`, `POST /requests/{id}/comments`, `POST /requests/{id}/decision`, `GET /requests?...`  
  Auth: **JWT (Cognito)**.

## Base de Datos

**Oracle (sistema de registro)**

- DDL simple: `sql/oracle_schema_simple.sql`
- Tablas principales: `APP_USER`, `REQUEST`, `REQUEST_ASSIGNMENT`, `REQUEST_COMMENT`, `REQUEST_DECISION`, `REQUEST_ATTACHMENT`, `NOTIFICATION`.
- Catálogos: `ROLE_CATALOG`, `PRIORITY_CATALOG`, `STATE_CATALOG`, `DECISION_CATALOG`.
- Índices prácticos e **índice único** para asegurar **una asignación activa** por solicitud.

**MongoDB (proyección de lectura)**

- Script: `mongo/mongo_schema_simple.js`
- Colecciones: `requests` (timeline embebido), `users` (opcional espejo), `notifications` (opcional).
- Índices para listados/timeline rápidos.

## Por qué Oracle (corto)

- **ACID** e invariantes fuertes (estados y asignaciones).
- Modelo relacional claro para reportes/joins.
- Mongo como **complemento** de lectura (no source of truth).

## Cómo levantar rápido (dev)

1. **Oracle**: ejecutar `sql/oracle_schema_simple.sql` (crear catálogos y tablas).
2. **Mongo**: correr `mongo/mongo_schema_simple.js` en la base deseada.
3. **API**: importar `docs/openapi-requests.yaml` en Swagger/Postman y probar.

## Próximos pasos

- Seeds mínimos (usuarios/solicitudes demo).
- Handlers de eventos → proyección Mongo.
- Dashboards básicos en Observabilidad.
