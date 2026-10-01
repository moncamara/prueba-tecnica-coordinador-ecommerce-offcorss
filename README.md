# 🛍️ OFFCORSS - Prueba Técnica: Coordinador(a) de Plataformas E-commerce

Solución integral desarrollada para la prueba técnica del rol **Coordinador(a) de Plataformas E-commerce** en **OFFCORSS**.

La plataforma conecta la visión y necesidades comerciales con una arquitectura técnica moderna, desacoplada y escalable, completamente desplegada y operativa en la nube.

---

## 🌐 Aplicación en Vivo (Producción)

Acceso directo a la plataforma desplegada:

- 🚀 **Portal Web (Frontend):** [https://moncamara.github.io/prueba-tecnica-coordinador-ecommerce-offcorss/](https://moncamara.github.io/prueba-tecnica-coordinador-ecommerce-offcorss/)
- ⚙️ **API Gateway / Backend (Render):** [https://offcorss-backend.onrender.com](https://offcorss-backend.onrender.com)
- 📊 **Endpoint GraphQL:** [https://offcorss-backend.onrender.com/graphql](https://offcorss-backend.onrender.com/graphql)
- 🔌 **Servicio Proxy Catálogo VTEX:** [https://offcorss-backend.onrender.com/api/vtex/products](https://offcorss-backend.onrender.com/api/vtex/products)
- 🗄️ **Base de Datos Cloud:** MongoDB Atlas (Cluster conectado en tiempo real)

---

## 🔑 Credenciales de Acceso

Para ingresar a la plataforma y evaluar todas las funcionalidades del Dashboard, utilice las credenciales configuradas en la base de datos:

| Campo | Valor |
| :--- | :--- |
| **Usuario (Username)** | `admin` |
| **Contraseña (Password)** | `admin123` |

---

## 🚀 Resumen de Requerimientos y Funcionalidades Desarrolladas

| Requerimiento Solicitado | Estado | Implementación Técnica |
| :--- | :---: | :--- |
| **Autenticación (Login)** | ✅ Cumplido | Validación segura de credenciales contra **MongoDB** mediante **GraphQL Mutation (`login`)** con tokens **JWT** y hashing criptográfico **bcryptjs**. |
| **Vista Detalle de Usuario** | ✅ Cumplido | Modal interactivo que consume **GraphQL Query (`me`)** mostrando `Username`, `Create Date`, `Name`, `Last Name`, `Email` y `User Type`. |
| **Edición y Actualización de Perfil** | ✅ Cumplido | Edición en tiempo real directamente sobre **MongoDB** mediante **GraphQL Mutation (`updateUser`)**. |
| **Consumo de API VTEX** | ✅ Cumplido | Servicio HTTP desacoplado en Node.js que consume la API pública oficial de catálogo de OFFCORSS (`https://offcorss.myvtex.com/api/catalog_system/pub/products/search/`). |
| **Listado de Productos (5+ campos)** | ✅ Cumplido | Visualización de `productId`, `Brand`, `productTitle`, listado de SKUs (`itemId`) e imágenes asociadas, además de precios, descuentos y estados de inventario. |
| **Filtro por Texto & Paginación** | ✅ Cumplido | Búsqueda predictiva multi-campo en tiempo real (por título, marca o referencia) y paginación fluida. |
| **Exportación a CSV** | ✅ Cumplido | Selección individual y masiva mediante checkboxes con descarga de archivo `.csv` formateado y codificado con BOM UTF-8 (compatible con Excel). |
| **Ficha de Detalle & Impresión** | ✅ Cumplido | Vista extendida de producto (PDP) con galería interactiva, selector de variantes/tallas y función de impresión optimizada para fichas técnicas (`@media print`). |
| **Cierre de Sesión (Logout)** | ✅ Cumplido | Invalidación y limpieza segura de la sesión y tokens en cliente. |
| **Framework CSS Tachyons** | ✅ Cumplido | Diseño ágil, responsive y fiel a la identidad visual de **OFFCORSS** implementado con **Tachyons CSS** y variables corporativas. |
| **Despliegue Cloud en Producción** | ✅ Cumplido | **Frontend** publicado en **GitHub Pages** (vía CI/CD con GitHub Actions), **Backend** publicado en **Render** y **Base de Datos** alojada en **MongoDB Atlas**. |

---

## 📐 Arquitectura Tecnológica

La solución implementa el patrón **BFF (Backend-For-Frontend)** para garantizar un alto rendimiento, seguridad de datos y evitar bloqueos por políticas de origen cruzado (CORS) con la API externa de VTEX.

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENTE / FRONTEND                   │
│   React 18 + TypeScript + Vite + Tachyons CSS (SPA)   │
│              Hosted on: GitHub Pages                   │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             │ HTTPS / Bearer JWT        │
             ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│     GraphQL Endpoint     │   │     REST Proxy VTEX      │
│   (Usuarios & Sesión)    │   │  (Catálogo de Productos) │
│       /graphql           │   │   /api/vtex/products     │
└────────────┬─────────────┘   └─────────────┬────────────┘
             │                               │
             ▼                               ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│      MongoDB Atlas       │   │  VTEX Intelligent Search │
│  Base de Datos en la Nube│   │    Catálogo OFFCORSS     │
└──────────────────────────┘   └──────────────────────────┘
```

### Stack de Tecnologías

- **Frontend:** React 18, TypeScript, Vite, React Router (HashRouter para SPA estático), Tachyons CSS, Lucide Icons.
- **Backend:** Node.js, Express, Apollo Server v4 (GraphQL), Mongoose ODM, Axios, JWT, Bcrypt.js.
- **Infraestructura Cloud:** GitHub Pages (Frontend Hosting & CI/CD Pipeline), Render (Web Service), MongoDB Atlas (Cloud Database).

---

## 👤 Autor

- **Candidata:** Mónica María Silva Brugés
- **Cargo al que postula:** Coordinador(a) de Plataformas E-commerce — OFFCORSS
- **Fecha:** Octubre 2026
