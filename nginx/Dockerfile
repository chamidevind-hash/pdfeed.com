FROM nginx:1.27-alpine

COPY nginx/templates /etc/nginx/file-convert-templates
COPY nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
  && rm -f /etc/nginx/conf.d/default.conf

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
