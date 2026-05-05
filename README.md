# Concesionario de Autos — Frontend

Frontend desarrollado en **Angular 19** + **Angular Material** para el sistema de gestión de un concesionario de autos.

## 🎥 Video demostrativo

> **[Ver video demostrativo aquí](https://REEMPLAZAR-CON-TU-ENLACE)**
>
> _(Reemplaza el enlace de arriba con la URL de tu video en YouTube, Drive u otra plataforma antes de entregar)_

---

## ⚙️ Requisitos previos

- **Node.js** v18 o superior — [Descargar](https://nodejs.org/)
- **Backend** corriendo en `http://127.0.0.1:8000` (FastAPI)

---

## 🚀 Instalación y ejecución

```bash
# 1. Entra a la carpeta del frontend
cd concesionario-frontend/web

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm start
```

Luego abre **http://localhost:4200** en tu navegador.

---

## 🗂️ Módulos CRUD implementados

| Módulo          | Crear | Consultar | Actualizar | Eliminar |
|-----------------|-------|-----------|------------|---------|
| Usuarios        | ✅    | ✅        | ✅         | ✅      |
| Clientes        | ✅    | ✅        | ✅         | ✅      |
| Empleados       | ✅    | ✅        | ✅         | ✅      |
| Vehículos       | ✅    | ✅        | ✅         | ✅      |
| Métodos de pago | ✅    | ✅        | ✅         | ✅      |
| Mantenimientos  | ✅    | ✅        | ✅         | ✅      |
| Ventas          | ✅    | ✅        | ✅         | ✅      |

---

## 🔌 Configuración del backend

La URL del backend se configura en:

```
web/src/environments/environment.ts
```

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000',
};
```

Asegúrate de que tu backend FastAPI tenga **CORS habilitado** para `http://localhost:4200`.

En tu `main.py` debe tener algo como:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🛠️ Stack tecnológico

- Angular 19 (Standalone Components)
- Angular Material 19
- TypeScript 5.6
- RxJS 7.8
