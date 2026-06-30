#!/bin/sh
set -eu

DOMAIN="${DOMAIN:-pdfeed.com}"
CERTIFICATE="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
PRIVATE_KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

if [ -s "${CERTIFICATE}" ] && [ -s "${PRIVATE_KEY}" ]; then
  cp /etc/nginx/file-convert-templates/https.conf /etc/nginx/conf.d/default.conf
  echo "TLS certificate found for ${DOMAIN}; HTTPS is enabled."
else
  cp /etc/nginx/file-convert-templates/http.conf /etc/nginx/conf.d/default.conf
  echo "No TLS certificate found for ${DOMAIN}; serving HTTP for ACME setup."
fi

exec /docker-entrypoint.sh "$@"
