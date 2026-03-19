# TicoAutos — Backend
🚗 Web API REST para la plataforma de compra y venta de vehículos TicoAutos.

Desarrollado como proyecto académico para la carrera de Ingeniería del Software en la Universidad Técnica Nacional (UTN), Costa Rica.

---

## 📌 Descripción

Este repositorio contiene el Web API REST que sirve como backend de la plataforma TicoAutos. Expone endpoints para autenticación de usuarios, gestión de vehículos y sistema de mensajería entre compradores y vendedores. El cliente (frontend) se conecta a esta API de forma desacoplada.

---

## ⚙️ Tecnologías

- Node.js + Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- nodemon

---

## 📂 Estructura del proyecto

```
ticoautos-backend/
 ├── controllers/
 │   ├── auth.controller.js       registro y login
 │   ├── vehicle.controller.js    CRUD de vehículos
 │   └── inbox.controller.js      sistema de mensajería
 ├── middleware/
 │   └── auth.middleware.js       verificación de JWT
 ├── models/
 │   ├── user.model.js            esquema de usuario
 │   ├── vehicle.model.js         esquema de vehículo
 │   └── conversation.model.js    esquema de conversación
 ├── routes/
 │   ├── auth.routes.js
 │   ├── vehicle.routes.js
 │   └── inbox.routes.js
 ├── server.js                    punto de entrada
 ├── .env                         variables de entorno (no en git)
 └── package.json
```

---

## 🚀 Instalación y ejecución

```bash
git clone https://github.com/juandagomez04/Ticoautos-backend.git
cd ticoautos-backend
npm install
```

Crear archivo `.env` en la raíz:
```
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/ticoautos
JWT_SECRET=tu_clave_secreta
PORT=3001
```

Ejecutar en modo desarrollo:
```bash
npm run dev
```

El servidor corre en: `http://localhost:3001`

---

## 📡 Endpoints REST

**Base URL:** `http://localhost:3001`

### /auth
| Método | Endpoint | Descripción | JWT |
|--------|----------|-------------|-----|
| POST | /auth/register | Registro de usuario | No |
| POST | /auth/token | Login — retorna JWT | No |
| GET | /auth/me | Verificar token activo | ✅ |

### /api/vehicles
| Método | Endpoint | Descripción | JWT |
|--------|----------|-------------|-----|
| GET | /api/vehicles | Listar con filtros y paginación | No |
| GET | /api/vehicles/:id | Ver detalle de vehículo | No |
| GET | /api/vehicles/my | Mis vehículos publicados | ✅ |
| POST | /api/vehicles | Publicar vehículo | ✅ |
| PUT | /api/vehicles/:id | Editar vehículo | ✅ |
| DELETE | /api/vehicles/:id | Eliminar vehículo | ✅ |
| PATCH | /api/vehicles/:id/status | Cambiar estado | ✅ |
| PATCH | /api/vehicles/:id/reserve | Reservar / cancelar reserva | ✅ |

### /api/inbox
| Método | Endpoint | Descripción | JWT |
|--------|----------|-------------|-----|
| GET | /api/inbox/my | Conversaciones como propietario | ✅ |
| GET | /api/inbox/bought | Conversaciones como comprador | ✅ |
| GET | /api/inbox/conversation/:v/:b | Detalle de conversación | ✅ |
| POST | /api/inbox/:vehicleId/message | Enviar mensaje (comprador) | ✅ |
| POST | /api/inbox/:vehicleId/reply | Responder (propietario) | ✅ |

---

## 🗂️ Modelo de entidades

### User
`name`, `lastName`, `email` (único), `passwordHash`, `createdAt`

### Vehicle
`brand`, `model`, `year`, `price`, `status` (disponible/reservado/vendido), `transmission`, `fuel`, `mileage`, `color`, `location`, `description`, `images[]`, `owner` (ref User), `reservedBy` (ref User)

### Conversation
`vehicle` (ref Vehicle), `buyer` (ref User), `owner` (ref User), `messages[]`
- messages: `{ sender, role (buyer/owner), text, createdAt }`

---

## 🔐 Seguridad

- Contraseñas encriptadas con bcryptjs (salt: 10).
- Autenticación con JWT — expiración de 2 horas.
- Rutas protegidas verifican propiedad del recurso antes de modificar.
- `.env` excluido del repositorio.
- Límite de payload de 10mb para imágenes en base64.

---

## 👨‍💻 Autor

**Juan Daniel Gómez Cubillo**
Ingeniería del Software — UTN Costa Rica
Curso: Programación en Ambiente Web II (ISW-711)
