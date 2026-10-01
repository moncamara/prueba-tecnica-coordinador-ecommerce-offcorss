# 🛍️ OFFCORSS - Prueba Técnica: Coordinador(a) de Plataformas E-commerce

Este repositorio contiene la solución completa, desacoplada y mantenible para la prueba técnica de **Coordinador(a) de Plataformas E-commerce** en **OFFCORSS**.

El proyecto conecta la lógica comercial con la arquitectura tecnológica a través de una aplicación web full-stack construida con **React.js, TypeScript, Tachyons CSS, Node.js, Express, GraphQL y MongoDB**.

---

## 🚀 Resumen de Requerimientos Cumplidos

| Requerimiento | Estado | Detalles de Implementación |
| :--- | :---: | :--- |
| **Autenticación (Login)** | ✅ Cumplido | Validación de usuario contra la Base de Datos vía **GraphQL Mutation (`login`)**. |
| **Vista Detalle de Usuario** | ✅ Cumplido | Muestra `Username`, `Create Date`, `Name`, `Last Name`, `Email` y `User Type`. |
| **Edición de Perfil** | ✅ Cumplido | Permite editar y actualizar en tiempo real los datos del usuario en la DB vía **GraphQL Mutation (`updateUser`)**. |
| **Consumo API VTEX** | ✅ Cumplido | Servicio HTTP proxy en Node.js que consume `https://offcorss.myvtex.com/api/catalog_system/pub/products/search/`. |
| **Listado de Productos (5 Campos)** | ✅ Cumplido | Muestra `productId`, `Brand`, `productTitle`, `ítems` (listado de SKU IDs) e `images`. |
| **Filtro por Texto & Paginación** | ✅ Cumplido | Buscador interactivo en tiempo real y paginación configurable. |
| **Exportación a CSV** | ✅ Cumplido | Selección de filas vía checkboxes y exportación formateada a `.csv`. |
| **Vista de Detalle & Impresión** | ✅ Cumplido | Ficha extendida con datos comerciales y función de impresión limpia con `@media print`. |
| **Diseño & Estilos (Tachyons CSS)** | ✅ Cumplido | Implementado con el framework **Tachyons CSS**, animaciones fluidas e identidad visual OFFCORSS. |
| **Despliegue en la Nube** | ✅ En Vivo | **Frontend:** GitHub Pages \| **Backend:** Render \| **Base de Datos:** MongoDB Atlas. |

---

## 🌐 Enlaces de Acceso en Vivo (Producción)

- **Frontend (GitHub Pages):** [https://moncamara.github.io/prueba-tecnica-coordinador-ecommerce-offcorss/](https://moncamara.github.io/prueba-tecnica-coordinador-ecommerce-offcorss/)
- **Backend (Render):** [https://offcorss-backend.onrender.com](https://offcorss-backend.onrender.com)
- **GraphQL Endpoint:** [https://offcorss-backend.onrender.com/graphql](https://offcorss-backend.onrender.com/graphql)
- **API Proxy VTEX:** [https://offcorss-backend.onrender.com/api/vtex/products](https://offcorss-backend.onrender.com/api/vtex/products)
- **Base de Datos:** MongoDB Atlas (Cluster en la nube conectado en tiempo real)


---

## 📐 Arquitectura de la Solución

```text
PruebaTecnica/
├── backend/                  # Servidor Node.js + Express + GraphQL + MongoDB / Mock Proxy
│   ├── src/
│   │   ├── config/           # Conexión a MongoDB (db.ts)
│   │   ├── graphql/          # Schema TypeDefs y Resolvers (schema.ts, resolvers.ts)
│   │   ├── models/           # Modelo de Mongoose para Usuarios (User.ts)
│   │   ├── services/         # Cliente HTTP para API pública de VTEX (vtexService.ts)
│   │   ├── seed.ts           # Script para sembrar usuario inicial en la DB
│   │   └── server.ts         # Punto de entrada Express + Apollo GraphQL
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # Aplicación SPA React + TypeScript + Tachyons CSS
    ├── src/
    │   ├── components/       # Navbar, UserProfileModal
    │   ├── context/          # AuthContext (Estado global de sesión)
    │   ├── pages/            # LoginPage, DashboardPage, ProductDetailPage
    │   ├── services/         # Clientes de API (GraphQL y REST VTEX)
    │   ├── types/            # Interfaces TypeScript
    │   ├── utils/            # Exportador CSV
    │   ├── App.tsx           # Enrutamiento protegido
    │   └── index.css         # Integración de Tachyons CSS + Reglas de Impresión
    ├── package.json
    └── vite.config.ts
```

---

## 🛠️ Instrucciones de Ejecución Local

### 1. Iniciar el Backend (Node.js + GraphQL)

1. Ingresa a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. *(Opcional)* Si tienes MongoDB ejecutándose localmente o en MongoDB Atlas, asegúrate de configurar tu archivo `.env`. Si no tienes MongoDB activo, **el servidor iniciará automáticamente en modo demo con datos en memoria** sin fallar.
4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   *El backend estará escuchando en `http://localhost:4000` (GraphQL Playground en `/graphql`).*

---

### 2. Iniciar el Frontend (React + TypeScript)

1. En una nueva terminal, ingresa a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación React:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en: `http://localhost:3000`

---

## 🔑 Credenciales de Prueba

Para ingresar al sistema utiliza las siguientes credenciales pre-configuradas:

- **Usuario (Username):** `admin`
- **Contraseña (Password):** `admin123`

---

## 📄 Guía de Despliegue en la Nube

### Backend en Render (https://render.com)
1. Conecta el repositorio de GitHub en Render.
2. Crea un **Web Service**.
3. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:** `PORT=4000`, `JWT_SECRET=tu_clave_secreta`.

### Frontend en Vercel / Netlify / GitHub Pages
1. Importa el proyecto seleccionando la carpeta `frontend`.
2. Configura:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
