# Hussein Al Rashdi Law Firm & Legal Consultancy

Premium bilingual Arabic / English static website for an Oman-based law firm. Built with React, Vite, and Tailwind CSS.

## Edit Content

- Main bilingual text, services, team members, articles, contact details, and social links: `src/siteData.js`
- SEO blog posts, high-intent FAQ content, and AI-friendly question/answer content: `src/seoContent.js`
- Brand colors and Tailwind tokens: the `@theme` block in `src/styles.css`
- Form endpoint: replace `https://formspree.io/f/EDIT_THIS_ENDPOINT` in `src/main.jsx`
- Sitemap/canonical domain: replace `https://example.com` in `index.html`, `public/sitemap.xml`, and `public/robots.txt`

## Images

The site uses open-license Wikimedia Commons image delivery URLs:

- Mutrah Corniche, Muscat: `Corniche, Muscat, Oman.jpg`
- Sultan Qaboos Grand Mosque: `Sultan Qaboos Grand Mosque (1).jpg`

Confirm final attribution requirements before production launch if you keep these images, or replace them with the firm’s licensed photography.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy on Netlify

1. Push the project to a Git repository.
2. In Netlify, choose **Add new site** then **Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy.

## Deploy on GitHub Pages

1. Push the project to GitHub.
2. Install dependencies and build locally or through GitHub Actions.
3. If deploying from a subpath such as `/repo-name/`, set Vite `base` in `vite.config.js`.
4. Publish the `dist` folder using GitHub Pages or an action such as `peaceiris/actions-gh-pages`.

## Notes

- Arabic is the default language and layout direction.
- The EN / عربي switch changes language and document direction.
- The contact form is static and does not process or store data until a Formspree endpoint is configured.
"# hussain-law" 
