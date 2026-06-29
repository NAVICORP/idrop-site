# iDrop - Premium Apple Resellers

Marketing website for **iDrop**, an Apple Authorised premium reseller in Sulthan Bathery, Wayanad, Kerala.
Static site (HTML / CSS / vanilla JS) - fast, zero-build, and ready to deploy to Vercel on the
subdomain **idrop.skifidesigns.com**.

## What's inside
```
idrop-site/
├── index.html            # the whole site (single page)
├── css/styles.css        # styles
├── js/main.js            # nav, scroll reveal, WhatsApp enquiry form
├── assets/
│   ├── logo-mark.svg      # recreated iDrop logo mark (vector)
│   ├── favicon.svg        # browser tab / app icon
│   └── og-image.png       # social-share preview image (1200×630)
├── vercel.json            # caching + security headers, clean URLs
├── robots.txt  sitemap.xml
└── README.md
```

## Business details baked in
- **Phone / WhatsApp:** +91 88480 26572  (wa.me/918848026572)
- **Instagram:** https://www.instagram.com/i.drop_/
- **Address:** Isaacs Centre Square, near KFC, Sulthan Bathery, Wayanad, Kerala 673592
- **Map + Google rating (4.4★)** embedded on the page.

> ⚠️ **Please double-check before launch:** the opening hours are shown as
> *"Open daily · 10:00 AM – 8:00 PM"* as a sensible default (Google only listed
> "Opens 10 AM"). Edit this in `index.html` (search for `Open daily`) if it's wrong.

---

## Deployment - GitHub + Vercel + Hostinger subdomain

You'll do this when you're awake (it needs your logins). It takes ~10 minutes.

### 1) Put the code on GitHub
1. Create a new repository on GitHub, e.g. **`idrop-site`** (Public or Private both work).
2. Upload these files. Easiest path: on the new repo page click **"uploading an existing file"**
   and drag in the **contents** of the `idrop-site` folder (so `index.html` sits at the repo root).
   *(Or, with git installed: `git init && git add . && git commit -m "iDrop site" && git branch -M main && git remote add origin <your-repo-url> && git push -u origin main`.)*

### 2) Deploy on Vercel
1. Go to https://vercel.com and sign in **with GitHub**.
2. **Add New → Project → Import** your `idrop-site` repo.
3. Framework preset: **Other**. Build command: *(leave empty)*. Output directory: *(leave empty / `.`)*.
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in under a minute.

### 3) Add the subdomain in Vercel
1. In the project → **Settings → Domains**.
2. Enter **`idrop.skifidesigns.com`** and click **Add**.
3. Vercel will show a **CNAME** target (usually `cname.vercel-dns.com`). Keep this tab open.

### 4) Point the subdomain from Hostinger
1. Log in to **Hostinger → Domains → skifidesigns.com → DNS / Nameservers** (DNS Zone editor).
2. **Add a new record:**
   - **Type:** `CNAME`
   - **Name / Host:** `idrop`
   - **Target / Points to:** `cname.vercel-dns.com`  *(use the exact value Vercel showed)*
   - **TTL:** default (e.g. 3600)
3. Save. *(If Hostinger won't allow a CNAME on the subdomain, use an **A record** for `idrop`
   pointing to `76.76.21.21` - Vercel will display the exact IP/instructions to use.)*

### 5) Done
- DNS usually propagates in a few minutes (can take up to a few hours).
- Vercel auto-issues a free **HTTPS certificate** once the record is detected.
- Visit **https://idrop.skifidesigns.com** 🎉

Any later edit you push to the GitHub repo auto-redeploys to the live site.

---

## Editing tips
- **Phone number:** search `918848026572` (links) and `88480 26572` (display) in `index.html`/`js/main.js`.
- **Opening hours / address:** search `Open daily` and `Isaacs Centre Square` in `index.html`.
- **Offers banner:** the `.announce` bar (top of `index.html`) and the "Seasonal offers" section.
- **Reviews:** in the `#reviews` section - real Google reviews are used; edit/add as you like.
- **Colours/fonts:** all design tokens live at the top of `css/styles.css` (`:root`).
