/**
 * The site's own address, used for metadataBase, canonical URLs, Open Graph,
 * the sitemap and robots.txt. Resolved at build time, in this order:
 *
 * 1. NEXT_PUBLIC_SITE_URL, set in Vercel once the custom domain is live
 *    (for example https://adam.bluemesa.se)
 * 2. VERCEL_URL, the address Vercel gives the deployment
 * 3. localhost, for `npm run dev` and `npm run start`
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

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
