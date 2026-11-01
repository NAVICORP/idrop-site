# iDrop, Premium Apple Resellers

The website for iDrop, Sulthan Bathery, Wayanad: https://idropdigital.com

| Where | What |
| --- | --- |
| `site/` | The site: `index.html`, `assets/idrop.css`, `assets/idrop.js`, fonts (Chakra Petch, Manrope), product photos, store photos, brand files, the terms PDFs |
| `deploy/` | `nginx.conf` and the Dokploy compose file |
| `tools/` | `photos.py` cuts the product photos, `og.html` for the share picture, `brand/` the logo source, `art/` and `key3d.py` the old 3D pieces (history, no longer on the site) |

Hosted on SkiFi's server with Dokploy: compose built from this repo (`./deploy/docker-compose.yml`), service `site`, port 8000. Push to `main` and Dokploy rebuilds.

## Photo sources

The product photos in `site/assets/photos/` are from Unsplash, under the Unsplash licence (free for commercial use, no attribution required). They were cropped and converted to WebP with `tools/photos.py`; the raw JPGs are not kept in the repo.

| File | Shows |
| --- | --- |
| `hero-iphone-orange` | iPhone 17 Pro in hand (hero, share picture) |
| `iphone-blue` | iPhone 17 Pro Max on dark blue velvet |
| `iphone-silver` | silver iPhone on black |
| `iphone-white` | white iPhone Pro on light grey |
| `watch` | Apple Watch on white |
| `mac` | MacBook Pro on a white desk |
| `ipad` | iPad Pro with Apple Pencil |
| `airpods-blue` | AirPods Pro on blue |
| `ecosystem` | iPhone, Apple Watch and AirPods together |

The store gallery photos in `site/assets/store/` are iDrop's own.
