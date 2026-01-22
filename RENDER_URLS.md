# URLs Actualizadas - Backend en Vercel

## ✅ Cambios Realizados

Se han actualizado todas las URLs del backend para usar **Vercel** en lugar de Render:

### Archivos Modificados:

1. **lib/api.ts**
    - Base URL: `https://nsg-backend.vercel.app`

2. **.env.local**
    - Variable de entorno actualizada a Vercel

---

## 🚀 Ventajas de Vercel

**Vercel** ofrece mejor rendimiento para el backend:

### Beneficios:

-   Despliegue automático más rápido
-   No hay modo "sleep" como en Render
-   Menor latencia en respuestas
-   Mejor integración con Next.js frontend

---

## 🔄 Para Desarrollo Local

Si prefieres usar el backend local durante desarrollo:

1. **Inicia el backend local**:

    ```bash
    cd NSG-Backend
    npm run dev
    ```

2. **Cambia la variable de entorno** en `.env.local`:

    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

3. **Recuerda revertir** antes de hacer commit

---

## 🚀 URLs Actuales

-   **Backend Producción**: `https://nsg-backend.vercel.app`
-   **Frontend Local**: `http://localhost:3001`
-   **Frontend Producción**: (pendiente)

---

## 📝 Notas

-   Las URLs se gestionan mediante variables de entorno
-   Vercel proporciona mejor tiempo de respuesta que Render
-   El backend está siempre activo, sin tiempos de "despertar"
