# URLs Actualizadas - Integración con Render

## ✅ Cambios Realizados

Se han actualizado todas las URLs del backend para usar **Render** en lugar de localhost:

### Archivos Modificados:

1. **FathomTokenModal.tsx**

    - URL: `https://nsg-backend.onrender.com/fathom/token`

2. **NSGHorizon.tsx**
    - URL Status: `https://nsg-backend.onrender.com/fathom/status`
    - URL Delete: `https://nsg-backend.onrender.com/fathom/token`

---

## ⚠️ Importante: Render Sleep Mode

**Render** pone los servicios gratuitos en modo "sleep" después de 15 minutos de inactividad.

### Síntomas:

-   Primera petición tarda 30-60 segundos
-   Error de timeout en la primera conexión
-   Funciona normal después de "despertar"

### Solución:

1. **Espera 30-60 segundos** en la primera petición
2. El servicio se "despierta" automáticamente
3. Las siguientes peticiones son rápidas

---

## 🔄 Para Desarrollo Local

Si prefieres usar el backend local durante desarrollo:

1. **Inicia el backend local**:

    ```bash
    cd NSG-Backend
    npm run dev
    ```

2. **Cambia las URLs** temporalmente a:

    ```typescript
    "http://localhost:3000/fathom/...";
    ```

3. **Recuerda revertir** antes de hacer commit

---

## 🚀 URLs Actuales

-   **Backend Producción**: `https://nsg-backend.onrender.com`
-   **Frontend Local**: `http://localhost:3001`
-   **Frontend Producción**: (pendiente)

---

## 📝 Notas

-   Las URLs están hardcodeadas por ahora
-   En el futuro, considera usar variables de entorno
-   Render puede tardar en despertar la primera vez
