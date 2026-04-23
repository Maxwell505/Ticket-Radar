# 🚨 TicketRadar

App para subir fotos de tickets de tráfico, ver la ubicación en Google Maps, y recibir alertas cuando estés a 900m de la zona.

---

## 🚀 OPCIÓN 1: Deploy con Vercel (más fácil, 5 minutos)

### Paso 1: Instalar Node.js
Si no lo tienes, descárgalo de https://nodejs.org (versión LTS)

### Paso 2: Subir a GitHub
1. Crea una cuenta en https://github.com si no tienes
2. Crea un nuevo repositorio llamado `ticket-radar`
3. Sube toda esta carpeta al repositorio:
```bash
cd ticket-radar
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ticket-radar.git
git push -u origin main
```

### Paso 3: Conectar con Vercel
1. Ve a https://vercel.com y crea cuenta con tu GitHub
2. Click "New Project"
3. Importa tu repositorio `ticket-radar`
4. Click "Deploy" — ¡listo!
5. Te dará una URL como `ticket-radar-xxx.vercel.app`

### Paso 4: Abrir en tu celular
1. Abre esa URL en Safari (iPhone) o Chrome (Android)
2. Acepta el permiso de ubicación cuando lo pida
3. ¡Listo! Sube la foto de tu ticket

### BONUS: Instalar como app en tu celular
- **iPhone**: Abre en Safari → botón compartir → "Agregar a pantalla de inicio"
- **Android**: Abre en Chrome → menú ⋮ → "Instalar app" o "Agregar a pantalla de inicio"

---

## 🚀 OPCIÓN 2: Deploy con Netlify

1. Ve a https://app.netlify.com
2. Arrastra la carpeta `build/` (después de hacer `npm run build`)
3. Te da una URL pública instantánea

---

## 💻 Probar en tu computadora primero

```bash
cd ticket-radar
npm install
npm start
```
Se abre en http://localhost:3000

---

## 📱 Probar en celular desde tu computadora (misma WiFi)

```bash
npm start
```
Busca la línea que dice `On Your Network: http://192.168.x.x:3000`
Abre esa dirección en tu celular (deben estar en la misma WiFi).

**Nota:** La cámara y GPS solo funcionan en HTTPS o localhost. Para probar en red local necesitarás HTTPS. Por eso es mejor usar Vercel directamente.

---

## ⚙️ Cómo funciona

1. **Subes foto del ticket** → La API de Claude analiza la imagen y extrae la dirección
2. **Geocoding** → Convierte la dirección a coordenadas GPS
3. **Google Maps** → Muestra la ubicación exacta del ticket
4. **Monitoreo GPS** → Tu ubicación se monitorea en tiempo real
5. **Alerta** → Cuando estás a 900m o menos de un ticket, aparece la alerta roja

## 📋 Requisitos

- Navegador moderno (Chrome, Safari, Firefox)
- Permiso de ubicación activado
- Conexión HTTPS (Vercel/Netlify lo incluyen automáticamente)
