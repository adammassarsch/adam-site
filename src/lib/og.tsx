import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "./brand";
import { printedDomain } from "./site-url";

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "assets/fonts");

// Read once when the module loads, so the cards are built at build time.
const [bold, medium] = await Promise.all([
  readFile(join(fontDir, "FamiljenGrotesk-Bold.ttf")),
  readFile(join(fontDir, "FamiljenGrotesk-Medium.ttf")),
]);

const fonts = [
  { name: "Familjen Grotesk", data: bold, weight: 700 as const, style: "normal" as const },
  { name: "Familjen Grotesk", data: medium, weight: 500 as const, style: "normal" as const },
];

type Card = {
  /** The release date on a case card, as on the case page itself. */
  date?: string;
  headline: string;
  /** The one highlighted figure and the words after it. */
  figure?: string;
  figureText?: string;
};

/** A fact's sentence up to its first colon: the part that names the figure. */
export function factLead(text: string): string {
  return text.split(":")[0]?.trim() ?? text;
}

/**
 * The link preview as a page of the record: masthead rule, the headline at
 * display scale, and the release's one highlighted figure at the foot.
 */
export async function renderCard({ date, headline, figure, figureText }: Card) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: brand.ground,
          color: brand.ink,
          fontFamily: "Familjen Grotesk",
          padding: "56px 72px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: 20,
            borderBottom: `2px solid ${brand.ink}`,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <span>Adam Massarsch</span>
          {printedDomain && <span style={{ fontWeight: 500, color: brand.mute }}>{printedDomain}</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", gap: 18 }}>
          {date && <span style={{ fontSize: 30, fontWeight: 500, color: brand.mute }}>{date}</span>}
          <span style={{ fontSize: headline.length > 60 ? 62 : 84, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.03em" }}>
            {headline}
          </span>
        </div>
        {figure && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              paddingTop: 22,
              borderTop: `1px solid ${brand.faint}`,
              fontSize: 30,
              fontWeight: 500,
            }}
          >
            <span style={{ background: brand.mark, padding: "0 8px", fontWeight: 700 }}>{figure}</span>
            {figureText && <span style={{ color: brand.ink }}>{figureText}</span>}
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts },
  );
}
