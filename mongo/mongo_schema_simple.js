// =====================================================================
// MongoDB
// Objetivo: optimizar lecturas del timeline y simplificar agregados.
// =====================================================================

/**
 * Colección: users
 * - Puede ser un espejo básico de Oracle para datos rápidos de contacto.
 */
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });

/**
 * Colección: requests
 * - Documento principal con campos clave y 'currentAssignment' embebido.
 * - Comentarios y decisiones embebidos para lecturas de timeline rápidas.
 * - Adjuntos como arreglo simple (o mover a colección aparte si crece mucho).
 */
db.createCollection("requests");

db.requests.createIndex({ state: 1, priority: 1, createdAt: -1 });
db.requests.createIndex({ "currentAssignment.assigneeId": 1 });
db.requests.createIndex({ "comments.createdAt": -1 });
db.requests.createIndex({ "decisions.createdAt": -1 });

/** Ejemplo de documento */
// {
//   _id: ObjectId(),
//   requestIdOracle: NumberLong(1234),           // ID relacional (referencia cruzada)
//   folio: "REQ-2025-000123",
//   title: "Alta de acceso VPN",
//   description: "Requiere aprobación de TI",
//   priority: "MEDIA",                            // BAJA|MEDIA|ALTA
//   state: "EN_REVISION",                         // NUEVA|ASIGNADA|EN_REVISION|APROBADA|DENEGADA|CERRADA
//   createdBy: { id: NumberLong(10), name: "Juan" },
//   currentAssignment: {
//     assigneeId: NumberLong(22),
//     assigneeName: "Ana Responsable",
//     active: true,
//     note: "Urgente"
//   },
//   attachments: [
//     { fileName: "evidencia.pdf", uri: "s3://bucket/key", size: 123456, mime: "application/pdf", uploadedById: 10, createdAt: ISODate() }
//   ],
//   comments: [
//     { id: ObjectId(), authorId: 10, authorName: "Juan", message: "Favor de revisar", createdAt: ISODate() }
//   ],
//   decisions: [
//     { id: ObjectId(), actorId: 22, actorName: "Ana", decision: "APROBADA", reason: "OK", createdAt: ISODate() }
//   ],
//   createdAt: ISODate(),
//   updatedAt: ISODate()
// }

/**
 * Colección: notifications (opcional)
 * - Para auditoría de envíos y reintentos.
 */
db.createCollection("notifications");
db.notifications.createIndex({ status: 1, scheduledAt: 1 });
db.notifications.createIndex({ requestIdOracle: 1 });

/**
 * Validadores (opcionales, sencillos) – puedes activarlos si quieres mayor control
 */
// db.runCommand({
//   collMod: "requests",
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["title", "priority", "state", "createdAt"],
//       properties: {
//         title: { bsonType: "string", minLength: 1 },
//         priority: { enum: ["BAJA", "MEDIA", "ALTA"] },
//         state: { enum: ["NUEVA","ASIGNADA","EN_REVISION","APROBADA","DENEGADA","CERRADA"] },
//         currentAssignment: {
//           bsonType: "object",
//           required: ["assigneeId", "active"],
//           properties: {
//             assigneeId: { bsonType: ["int","long","double"] },
//             active: { bsonType: "bool" }
//           }
//         }
//       }
//     }
//   }
// });
