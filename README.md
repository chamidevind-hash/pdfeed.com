# PDFeed

A full MVP file conversion website built with Next.js and Express. It includes a
modern responsive interface, SEO-focused tool pages, temporary randomized file
storage, automatic deletion after one hour, and launch-stage free beta limits.

## Free beta limits

- No login or registration required
- 10 successful conversions per IP during each 24-hour window
- 25MB maximum size per uploaded file
- Failed conversions do not consume the daily allowance
- Usage is stored in application memory for the beta stage

The API returns quota details with successful conversion responses and limit
errors. `GET /api/convert/quota` returns the current IP's remaining allowance.
Health checks and file downloads are not rate limited.

The in-memory usage map resets when the backend restarts. Move this state to
Redis or another shared store before running multiple backend replicas.

## Included tools

- Word to PDF using LibreOffice
- Excel to PDF using LibreOffice
- JPG/PNG to PDF using Sharp and pdf-lib
- PDF to JPG using Poppler's `pdftoppm`
- Merge PDF using pdf-lib
- Split PDF into one PDF per page, returned as a ZIP
- Compress PDF using Ghostscript
- PDF to Word using ConvertAPI when configured, local pdf2docx, LibreOffice,
  and an open-source PyMuPDF/python-docx fallback

## Project structure

```text
.
├── frontend/
│   ├── app/                  # Next.js App Router pages and metadata
│   ├── components/           # Reusable UI and converter components
│   └── lib/                  # Tool configuration and SEO content
├── backend/
│   ├── uploads/              # Temporary source files
│   ├── converted/            # Temporary output files
│   └── src/
│       ├── middleware/       # Multer upload rules
│       ├── routes/           # Convert and download routes
│       ├── services/         # PDF, image, office, archive, cleanup
│       └── utils/            # File and error utilities
├── .env.example
└── package.json              # Workspace scripts
```

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- LibreOffice for Word and Excel conversion
- Poppler for PDF to JPG
- Ghostscript for PDF compression
- Python 3.10 or newer for local PDF to Word conversion

The JPG/PNG to PDF, merge PDF, and split PDF tools work with Node dependencies
only.

### PDF to Word providers

`PDF_TO_WORD_PROVIDER=auto` uses the first successful provider in this order:

1. ConvertAPI, when `CONVERTAPI_TOKEN` is configured. This provides the best
   fidelity and supports OCR for scanned PDFs.
2. Local `pdf2docx`, which reconstructs text, images, tables, and layout.
3. LibreOffice PDF import/export, when the installed build supports it.
4. A local PyMuPDF and python-docx fallback that preserves text runs, basic font
   styling, images, page sizes, and page breaks.

Install the local Python dependencies:

```bash
npm run setup:python --workspace backend
```

To force one provider, set `PDF_TO_WORD_PROVIDER` to `convertapi`, `pdf2docx`,
`libreoffice`, or `fallback`. Set `PYTHON_PATH` when Python is not available as
`python`.

### Windows external tools

Install the required applications, then either add their executable directories
to `PATH` or set absolute paths in `backend/.env`.

Typical executable names:

```text
LibreOffice:  C:\Program Files\LibreOffice\program\soffice.exe
Poppler:      C:\path\to\poppler\Library\bin\pdftoppm.exe
Ghostscript:  C:\Program Files\gs\gs10.xx.x\bin\gswin64c.exe
```

Example `backend/.env` values:

```dotenv
LIBREOFFICE_PATH=C:\Program Files\LibreOffice\program\soffice.exe
PDFTOPPM_PATH=C:\path\to\poppler\Library\bin\pdftoppm.exe
GHOSTSCRIPT_PATH=C:\Program Files\gs\gs10.xx.x\bin\gswin64c.exe
PDF_TO_WORD_PROVIDER=auto
PYTHON_PATH=python
CONVERTAPI_TOKEN=
```

On macOS, install the tools with Homebrew:

```bash
brew install --cask libreoffice
brew install poppler ghostscript
```

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install libreoffice poppler-utils ghostscript
```

## Setup

1. Install all workspace dependencies:

   ```bash
   npm install
   ```

2. Create environment files:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   Copy-Item frontend/.env.example frontend/.env.local
   ```

3. Update executable paths in `backend/.env` if the commands are not on
   `PATH`.

4. Install the local PDF to Word engine:

   ```bash
   npm run setup:python --workspace backend
   ```

5. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`. The API runs on `http://localhost:4000`.

## Scripts

```bash
npm run dev              # Run frontend and backend in development
npm run dev:frontend     # Run only Next.js
npm run dev:backend      # Run only Express
npm run build            # Build the Next.js production app
npm run check            # Check backend syntax and build frontend
npm run start:frontend   # Start a built Next.js app
npm run start:backend    # Start the Express API
```

## API

All conversion endpoints accept `multipart/form-data`.

```text
POST /api/convert/word-to-pdf     field: file
POST /api/convert/pdf-to-word     field: file
POST /api/convert/excel-to-pdf    field: file
POST /api/convert/jpg-to-pdf      field: files
POST /api/convert/pdf-to-jpg      field: file
POST /api/convert/merge-pdf       field: files
POST /api/convert/split-pdf       field: file
POST /api/convert/compress-pdf    field: file
GET  /api/download/:fileId
GET  /api/health
GET  /api/convert/quota
```

A successful conversion returns:

```json
{
  "fileId": "random-uuid.pdf",
  "fileName": "document-converted.pdf",
  "downloadUrl": "/api/download/random-uuid.pdf?name=document-converted.pdf",
  "expiresInSeconds": 3600
}
```

## Security behavior

- Maximum upload size is 25MB per file.
- Only PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, and PNG extensions are accepted.
- Each stored file receives a cryptographically random UUID filename.
- Uploaded files are passed as process arguments and are never executed.
- Download IDs are validated and constrained to the converted file directory.
- Source files are removed immediately after conversion.
- Converted files are removed after one hour by the cleanup job.
- Express uses Helmet and a restricted CORS origin.
- Conversion routes enforce 10 successful conversions per IP every 24 hours.

For production, run the backend and frontend behind HTTPS, use a dedicated
unprivileged service account, add request rate limiting, and consider isolated
conversion workers for stronger process containment.

## Docker production deployment

The included Compose stack deploys:

- A standalone Next.js frontend container
- An Express conversion container with LibreOffice, Poppler, Ghostscript,
  pdf2docx, PyMuPDF, and python-docx installed
- Nginx as the only publicly exposed service
- Certbot volumes and an ACME webroot for Let's Encrypt
- Persistent temporary upload and conversion volumes

The production hostname is `pdfeed.com`. Point its DNS `A`/`AAAA`
records to the Docker host before requesting a certificate.

### Start the HTTP stack

Create the production environment file:

```bash
cp .env.production.example .env
```

Build and start the application:

```bash
docker compose up -d --build
docker compose ps
```

Nginx initially serves HTTP and exposes
`/.well-known/acme-challenge/` for certificate validation.

### Enable HTTPS

Request the first certificate after DNS is live and ports 80 and 443 are open:

```bash
docker compose --profile ssl run --rm certbot
docker compose restart nginx
```

On restart, the Nginx entrypoint detects the certificate under
`/etc/letsencrypt/live/pdfeed.com/` and automatically enables:

- HTTPS on port 443
- HTTP-to-HTTPS redirects
- TLS 1.2 and TLS 1.3
- HSTS and basic security headers

Renew certificates with:

```bash
docker compose --profile ssl run --rm certbot renew
docker compose restart nginx
```

Schedule those renewal commands with the host's cron or systemd timer. Certbot
stores certificates in the `letsencrypt_data` Docker volume, so they survive
container replacement.

### Deployment commands

```bash
docker compose logs -f
docker compose pull
docker compose up -d --build
docker compose down
```

Do not use `docker compose down -v` in production unless you intentionally want
to delete certificates and temporary-file volumes.
