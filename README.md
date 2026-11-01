# iDrop, Premium Apple Resellers

The website for iDrop, Sulthan Bathery, Wayanad: https://idropdigital.com

| Where | What |
| --- | --- |
| `site/` | The site: `index.html`, `assets/idrop.css`, `assets/idrop.js`, fonts (Chakra Petch, Manrope), 3D pieces, brand files, the terms PDFs |
| `deploy/` | `nginx.conf` and the Dokploy compose file |
| `tools/` | `art/` the 3D source sheets, `key3d.py` that cuts them, `og.html` for the share picture, `brand/` the logo source |

Hosted on SkiFi's server with Dokploy: compose built from this repo (`./deploy/docker-compose.yml`), service `site`, port 8000. Push to `main` and Dokploy rebuilds.
