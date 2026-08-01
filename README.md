# Cuenta Clara — proyecto instalable (PWA)

## 1. Compilar
```bash
npm install
npm run build
```
Esto genera la carpeta `dist/` con todo lo que hay que subir (HTML, JS, CSS, íconos, manifest y service worker).

## 2. Subir a tu NAS
Copia el contenido de `dist/` a la carpeta que sirva tu Nginx, por ejemplo:
```bash
scp -P 2222 -r dist/* juan@nas-juan:/ruta/a/cuentaclara/
```

Ejemplo de bloque Nginx (nuevo subdominio, con tu Certbot de siempre):
```nginx
server {
    listen 443 ssl;
    server_name cuentaclara.jctecnologia.xyz;

    ssl_certificate     /etc/letsencrypt/live/cuentaclara.jctecnologia.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cuentaclara.jctecnologia.xyz/privkey.pem;

    root /ruta/a/cuentaclara;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Luego: `certbot --nginx -d cuentaclara.jctecnologia.xyz` (o tu script de Porkbun+DuckDNS si prefieres subdominio DDNS) y recarga Nginx.

**Importante:** el manifest y el service worker solo funcionan bien servidos por **HTTPS** (o localhost). Con Certbot ya lo tienes cubierto.

## 3. Instalar en el teléfono

**Android (Chrome):**
1. Abre `https://cuentaclara.jctecnologia.xyz` en Chrome.
2. Toca el menú (⋮) → "Instalar aplicación" (o aparecerá un banner automático).
3. Queda como app en el cajón de aplicaciones.

**iPhone (Safari — obligatorio, no funciona desde Chrome en iOS):**
1. Abre la URL en Safari.
2. Toca el ícono de compartir (cuadro con flecha hacia arriba).
3. "Añadir a pantalla de inicio".
4. Queda como app con tu ícono, sin barra de navegador.

## Notas
- Los datos (movimientos, cuentas, categorías) se guardan en el propio teléfono (localStorage), no en un servidor. Cada instalación/dispositivo tiene sus propios datos.
- Si cambias el código, vuelve a correr `npm run build` y sube de nuevo `dist/`.
