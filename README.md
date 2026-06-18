# Chibuikem Okonkwo — Portfolio

A fast, single-page personal portfolio with a dark cyber / terminal aesthetic.
Built with hand-written **HTML, CSS, and vanilla JavaScript** — no build step, no
dependencies, no framework.

## ✨ Features

- Animated typing **terminal** hero
- Subtle **matrix-rain** canvas background (auto-pauses when the tab is hidden)
- Scroll-reveal animations and animated **stat counters**
- Sticky nav with scroll-spy active highlighting + mobile menu
- Sections: About · Skills · Experience timeline · Projects · Certifications · Education · Contact
- Fully **responsive** and **accessible** (skip link, focus styles, ARIA, `prefers-reduced-motion` support)
- SEO + Open Graph meta tags

## 📁 Structure

```
portfolio/
├── index.html          # all content / markup
├── css/
│   └── styles.css      # theme + layout (CSS variables at the top)
├── js/
│   └── main.js         # terminal, reveal, counters, matrix, nav
├── assets/
│   ├── favicon.svg
│   └── Chibuikem-Okonkwo-Resume.pdf   # ← add your PDF here (see below)
└── README.md
```

## ▶️ Run locally

It's static, so just open `index.html` in a browser. For a local server
(recommended, so fonts/paths resolve cleanly):

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## 📄 Resume

The hero's **Resume** button links to a Google Doc, exported as PDF on the fly:

```
https://docs.google.com/document/d/<FILE_ID>/export?format=pdf
```

Because it exports live, **editing the Google Doc updates the resume on the site
automatically** — no commit or redeploy needed. The Doc must stay shared as
*"Anyone with the link → Viewer"*. A copy also lives in `assets/` as an offline
fallback (not used by the button).

## 🚀 Deploy (free options)

| Host | How |
|------|-----|
| **GitHub Pages** | Push to a repo → Settings → Pages → deploy from `main` / root. |
| **Netlify** | Drag-and-drop the `portfolio` folder onto app.netlify.com, or connect the repo. |
| **Vercel** | `vercel` in the folder, or import the repo — no framework preset needed. |
| **Cloudflare Pages** | Connect the repo; build command: *none*, output dir: `/`. |

## 🎨 Customize

- **Colors** — edit the CSS variables under `:root` in [css/styles.css](css/styles.css)
  (`--primary` is the neon-green accent, `--secondary` the cyan).
- **Terminal lines** — edit the `lines` array in [js/main.js](js/main.js).
- **Content** — everything else lives directly in [index.html](index.html).

---

Designed & built by **Chibuikem Okonkwo** · Lagos, Nigeria
