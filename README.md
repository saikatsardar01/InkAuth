# 📚 Ink Auth

Ink Auth is a modern **digital reading platform** for books, blogs, and radio-inspired learning experiences. It combines structured reading, audio streaming, and a clean UI to create an immersive knowledge ecosystem.

🌐 Live: https://www.inkauth.in/ 

---

## ✨ Features

- 📖 Digital books with chapters and navigation
- 📰 Blog system with categories and tags
- 🔍 SEO-friendly routing (sitemap, RSS, robots)
- 📻 Built-in radio player for continuous listening
- 🧭 Smooth navigation with dynamic routes
- 🌙 Theme support (light/dark mode)
- ⚡ Fast performance with Next.js App Router
- 📱 Fully responsive UI for all devices
- 🔔 Newsletter and engagement components

---

## 📂 Project Structure

<details>
<summary>Click to expand</summary>

```text
Ink Auth
├── app
│   ├── api
│   │   ├── books
│   │   │   └── route.ts
│   │   └── revalidate
│   │       └── route.ts
│   ├── blog
│   │   ├── [slug]
│   │   ├── category/[category]
│   │   ├── tag/[tag]
│   │   └── page.tsx
│   ├── blog-sitemap.xml
│   │   └── route.ts
│   ├── books
│   │   └── [slug]
│   │       ├── page.tsx
│   │       └── [chapterSlug]
│   │           └── page.tsx
│   ├── categories
│   │   ├── [slug]
│   │   └── page.tsx
│   ├── coming-soon
│   │   └── page.tsx
│   ├── library
│   │   └── page.tsx
│   ├── privacy
│   │   └── page.tsx
│   ├── radio
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── terms
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.ts
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   ├── rss.xml
│   │   └── route.ts
│   ├── sitemap.ts
│   └── sw.ts
│
├── components
│   ├── BlogSearch.tsx
│   ├── BlogShareButtons.tsx
│   ├── BookCard.tsx
│   ├── ContributeBanner.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LatexRenderer.tsx
│   ├── Navbar.tsx
│   ├── NewsletterCTA.tsx
│   ├── RadioPlayer.tsx
│   ├── RadioToggle.tsx
│   ├── ScrollProgress.tsx
│   ├── ShareButton.tsx
│   ├── StationCard.tsx
│   ├── TableOfContents.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
│
├── lib
│   ├── blog-db.ts
│   ├── db.ts
│   ├── radio-store.ts
│   ├── schema.sql
│   ├── turso.ts
│   └── blog-migration.sql
│
├── public
│   ├── icons
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── sw.js
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── middleware.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

</details>

---

## 🛠 Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Turso / SQLite
- Service Workers (PWA support)
- RSS + SEO tooling

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open: http://localhost:3000

---

## 📡 Features Overview

### 📖 Books System
- Multi-chapter reading experience
- Dynamic routing per book and chapter

### 📰 Blog System
- Categories & tags
- SEO optimized pages
- RSS feed support

### 📻 Radio System
- Live station streaming
- Mini player + toggle UI
- Background listening support

---

## 🔍 SEO & Performance

- Sitemap generation
- Robots.txt
- RSS feed
- Service worker caching
- Optimized routing with Next.js

---

## 👨‍💻 Author

Built by Saikat Sardar

---

## ❤️ About

Ink Auth is designed to unify reading, learning, and audio experiences into one seamless platform.