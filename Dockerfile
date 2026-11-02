# idropdigital.com on SkiFi's own server: the static site in site/, served by nginx.
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY site /usr/share/nginx/html
# Ask for the styles and the script by a version made from their content, so a phone that
# kept an older copy fetches the new one as soon as the site changes.
RUN cd /usr/share/nginx/html && v=$(cat assets/idrop.css assets/idrop.js | md5sum | cut -c1-10) \
 && sed -i "s#/assets/idrop.css\"#/assets/idrop.css?v=$v\"#; s#/assets/idrop.js\"#/assets/idrop.js?v=$v\"#" index.html \
 && grep -q "idrop.css?v=$v" index.html && grep -q "idrop.js?v=$v" index.html
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:8000/health || exit 1
