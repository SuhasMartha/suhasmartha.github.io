---
title: "Building a Modern Portfolio Website: A Complete Tech Stack and Development Journey"
slug: "Modern-Portfolio-Website"
date: "2025-08-12"
tags: ["Portfolio","GitHub","Web Dev","Blogging","Project"]
author: "Suhas Martha"
readTime: "6 min read"
image: "https://i.postimg.cc/sgrJqRS8/Screenshot-2025-08-30-161941.png"
excerpt: "Creating a standout developer portfolio is essential for showcasing your skills, projects, and professional journey. In this blog post, we dive into the development of **suhasmartha.github.io**, a modern, responsive portfolio website built with React, Vite, Tailwind CSS, and powered by Supabase for backend services. You’ll learn about the tech stack, architecture, feature implementations, deployment workflow, and how Supabase elevates the site with dynamic content and data handling."
featured: false

---

## Project Overview

**suhasmartha.github.io** is a single-page application portfolio that highlights:

- Personal bio and skills
- Education, experience, and fun facts
- Project showcases (full-stack and frontend)
- Technical blog with MDX-powered posts
- Interactive games section
- Contact form with real-time backend storage

The goal was to create a performant, accessible, and visually engaging site that reflects a developers capabilities and personality.

***

## Tech Stack

| Layer | Technology | Role |
| :-- | :-- | :-- |
| UI Framework | React 19 | Component-driven interface |
| Bundler \& Dev Server | Vite | Fast HMR, optimized builds |
| Styling | Tailwind CSS 3.x | Utility-first design, dark/light mode support |
| Routing | React Router v7 | Hash-based SPA navigation |
| Backend as a Service | Supabase | Database, Auth, Functions, real-time services |
| Hosting | GitHub Pages | Free, global CDN |


***

## Project Structure \& Architecture

```
repo-root/
├── .gitignore
├── .prettierrc
├── .vscode/
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public/
├── src/
│   ├── App.jsx
│   ├── Navbar.jsx
│   ├── animations/
│   ├── assets/
│   ├── components/
│   ├── index.css
│   ├── main.jsx
│   ├── pages/
│   ├── styles/
│   └── utils/
└── vite.config.js

```

- **Component-Based Design** ensures maintainability.
- **HashRouter** enables seamless GitHub Pages hosting.
- **Tailwind CSS** theming and responsive utilities for consistent UI.

***

## Frontend Features \& UX

### Responsive \& Accessible Design

- Mobile-first layouts with Tailwind breakpoints
- Dark/light theme toggle using CSS variables
- Semantic HTML and ARIA roles for screen readers


### Advanced Animations

- **Framer Motion** for page transitions and hover effects
- **GSAP** timelines for scroll-triggered and complex animations


### Interactive Sections

- **Projects**: Animated cards, filterable by category
- **Blog**: MDX-powered posts with dynamic routing
- **Games**: In-browser classics like Tic-Tac-Toe, Snake, Tetris, and more
- **Contact**: Animated form with real-time feedback

***

## Supabase Backend Integration

By adopting Supabase, the portfolio gains robust backend capabilities without managing servers.

1. **Contact Form Handling**
    - Submissions are validated client-side and inserted into a Supabase table.
    - Real-time storage of inquiries triggers email notifications via Supabase Functions.
2. **Blog Content Management**
    - Posts are authored in Markdown with frontmatter metadata stored in Supabase.
    - At build time, Vite fetches post data via Supabase's REST API for dynamic previews.
3. **Authentication \& Admin Interface**
    - **Supabase Auth** secures an `/admin` dashboard for drafting and publishing posts.
    - Role-based policies restrict write access to authenticated users.
4. **Analytics \& Usage Tracking**
    - Page views, form submissions, and event logs stream into Supabase for real-time dashboards.
    - Custom analytics interface displays unique visitors, popular posts, and conversion metrics.

***

## Build \& Deployment Workflow

### Local Development

```bash
npm install
npm run dev    # Launches Vite dev server at http://localhost:5173
```


### Automated CI/CD with GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: production-files, path: ./dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with: { name: production-files, path: ./dist }
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
```

- Push to **main** triggers build, artifact upload, and deployment to **gh-pages** branch.
- Zero-downtime, CDN-backed hosting with HTTPS.

***

## Future Enhancements

- **Progressive Web App (PWA)** capabilities for offline access.
- **Comment system** for blog posts.
- **Video tutorials** and embedded demos.
- **Multi-language support** for global reach.
- **Custom domain** with enhanced branding.

***

## Conclusion

Building **suhasmartha.github.io** demonstrates how modern web tools and backend services can coalesce into a fast, interactive, and maintainable portfolio site. By leveraging React, Vite, Tailwind CSS, and Supabase, developers can create rich digital resumes that not only showcase projects but also handle dynamic content, authentication, and real-time interactions, all with minimal infrastructure overhead.

Ready to build your own? Explore the full [GitHub repository](https://github.com/SuhasMartha/suhasmartha.github.io), fork it, and start customizing a portfolio that highlights your unique story and skills.
