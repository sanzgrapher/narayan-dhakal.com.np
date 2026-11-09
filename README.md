# narayan-dhakal.com.np

Personal site. Astro 6 + Tailwind v4 + MDX, built as static HTML and deployed on Vercel.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

## Content

- **Profile, stack, experience** — `src/data/profile.ts`
- **Projects** — one `.mdx` file per project in `src/content/projects/`. The filename is the URL slug (`/projects/<filename>`).
  - `kind: collaboration` → Collaborations section
  - `kind: personal` + `visibility: public` → Open source section
  - `kind: personal` + `visibility: private` → Private builds section
  - Sort with `order`, hide with `draft: true`. Schema lives in `src/content.config.ts`.
- **Posts** — `.mdx` files in `src/content/posts/` (`/blog/<filename>`).

## Deploy

Import the repo in Vercel; the Astro preset needs no extra config.

Astro is pinned to v6 because v7 requires Node ≥ 22.23.4. The `vite` override in `package.json` keeps `@tailwindcss/vite` on the same Vite major as Astro.
