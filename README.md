# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Turso API-Service auf Render

Die Lernmodule und Benutzerfortschritte können über den Node.js-Web-Service in `server/server.js` in Turso gespeichert werden. Der Service nutzt nur Node-Bordmittel und spricht Turso über die libSQL-HTTP-Pipeline an.

### Environment Variables

Frontend (`Next.js`):

```bash
NEXT_PUBLIC_KAI_API_URL=https://dein-render-service.onrender.com
```

Render Web Service:

```bash
PORT=10000
TURSO_DATABASE_URL=https://<database>-<org>.turso.io
TURSO_AUTH_TOKEN=<turso-db-token>
JWT_SECRET=<lange-zufaellige-geheime-zeichenfolge>
CORS_ORIGIN=https://deine-frontend-domain.example
```

### Render Start Command

```bash
npm run api:start
```

### Datenbank vorbereiten

Nach dem Deploy können Schema und Startdaten gegen den Render-Service angelegt werden:

```bash
KAI_API_URL=https://dein-render-service.onrender.com npm run api:migrate
KAI_API_URL=https://dein-render-service.onrender.com npm run api:seed
```

Der Service stellt diese Kernrouten bereit:

- `GET /health` für Render Health Checks.
- `GET /modules` und `GET /modules/:moduleId` für Lernmodule aus Turso.
- `POST /auth/register` und `POST /auth/login` für Benutzerkonten.
- `GET /me/progress` und `PUT /me/progress` für angemeldeten Lernfortschritt.

## Lokales Setup / npm-Installation

Für reproduzierbare Installationen ist ein `package-lock.json` eingecheckt. Nutze nach Möglichkeit:

```bash
npm ci
```

Das Projekt enthält außerdem eine `.npmrc`, die `legacy-peer-deps` und konservativere Fetch-Retry-Einstellungen setzt. Dadurch muss `--legacy-peer-deps` nicht mehr manuell angegeben werden.

Wenn unter Windows weiterhin `ERR_SSL_CIPHER_OPERATION_FAILED`, `EPERM` oder `ENOTEMPTY` erscheint, liegt das meistens nicht an einer fehlenden Projektdatei, sondern an einem beschädigten npm-Cache, gesperrten Dateien in `node_modules` oder einem lokalen TLS/Antivirus/Proxy-Eingriff. Führe dann in PowerShell im Projektordner eine komplett saubere Installation aus:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm cache clean --force
npm cache verify
npm ci
```

Falls der SSL-Fehler danach noch auftritt, teste zusätzlich eine frische PowerShell ohne laufenden Editor/Dev-Server und prüfe, ob Antivirus, VPN oder Firmen-Proxy HTTPS-Downloads von `https://registry.npmjs.org/` scannt oder unterbricht. Die `npm warn cleanup`-Meldungen sind nur Folgefehler beim Aufräumen; entscheidend ist der `ERR_SSL_CIPHER_OPERATION_FAILED`-Abbruch.
