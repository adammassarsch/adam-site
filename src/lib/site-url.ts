/**
 * The site's own address, used for metadataBase, canonical URLs, Open Graph,
 * the sitemap and robots.txt. Resolved at build time, in this order:
 *
 * 1. NEXT_PUBLIC_SITE_URL, set in Vercel for Production to the canonical
 *    address, https://www.adammassarsch.se. Without it, step 2 applies, and
 *    Vercel picks the shortest custom domain: that can be adammassarsch.se,
 *    which only redirects to www
 * 2. In production on Vercel: VERCEL_PROJECT_PRODUCTION_URL, the project's
 *    stable public address. The per-deployment address can sit behind
 *    Vercel's deployment protection, where link previews cannot reach it.
 * 3. In preview deployments: VERCEL_URL, the address of that deployment
 * 4. localhost, for `npm run dev` and `npm run start`
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (process.env.VERCEL_ENV === "production" && production) return `https://${production}`;

  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return `https://${deployment}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const siteUrl = resolveSiteUrl();

/**
 * The domain printed on link-preview images. Only a chosen public address is
 * printed; a generated Vercel or local address is left off the card.
 */
export const printedDomain: string | undefined = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  ? new URL(siteUrl).host
  : undefined;
