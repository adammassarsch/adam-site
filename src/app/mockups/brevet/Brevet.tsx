import Image from "next/image";
import { Inter, Newsreader } from "next/font/google";
import { profile } from "@content/profile";
import { repoUrl } from "@content/site";
import { mailto, mockProjects } from "../shared";
import type { BrevetCopy } from "./copy";
import { LazyDemo } from "./LazyDemo";
import { Seal } from "./Seal";
import "./brevet.css";

/*
 * Only what the page uses: Newsreader 400 for headings and results, Inter 400
 * and 600 for text. The heading font is preloaded, since the first screen is
 * set in it; the body font swaps in from a metric-matched fallback.
 */
const serif = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--b-serif",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--b-sans",
  preload: false,
});

export const brevetPaths = {
  sv: "/mockups/brevet",
  en: "/mockups/brevet/en",
} as const;

/*
 * The envelope. The page is open by default: without JS or with reduced motion
 * no envelope is drawn. This runs before the content below it is painted, so a
 * sealed page never flashes open first. Where the browser has scroll-driven
 * animations, the scroll position is the animation: the first 360 px of
 * scroll open the letter. Elsewhere the first scroll plays it on a timer.
 * Keyboard focus inside the letter scrolls past the envelope, so nothing
 * focusable is ever hidden behind it. Past the range, .bv-past hides the
 * envelope outright, independent of the animation: Safari runs scroll-driven
 * animations on its scrolling thread, and after a layout change (opening a
 * video) it was seen drawing the whole seal over the letter.
 */
const sealScript = `(function(){
var r=document.currentScript.parentElement,R=360;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
r.classList.add("bv-on");
var past=null;function chk(){var p=scrollY>=R-1;if(p!==past){past=p;r.classList.toggle("bv-past",p)}}
chk();addEventListener("scroll",function(){requestAnimationFrame(chk)},{passive:true});
addEventListener("pageshow",chk);
addEventListener("focusin",function(e){var s=r.querySelector(".bv-sheet");
if(s&&s.contains(e.target)&&scrollY<R)scrollTo(0,R)},true);
if(window.CSS&&CSS.supports("animation-timeline: scroll()"))return;
r.classList.add("bv-fallback");
if(scrollY>4||location.hash){r.classList.add("bv-open","bv-done");return}
var E=["scroll","wheel","touchmove","keydown","pointerdown","hashchange"],o=false;
function open(){if(o)return;o=true;
E.forEach(function(e){removeEventListener(e,open,true)});
r.classList.add("bv-open");
setTimeout(function(){r.classList.add("bv-done")},1500)}
E.forEach(function(e){addEventListener(e,open,{passive:true,capture:true})});
})();`;

export function Brevet({ copy: t }: { copy: BrevetCopy }) {
  const video = (slug: string) =>
    mockProjects.find((p) => p.slug === slug)?.video;

  return (
    // The seal script adds classes to this element before hydration.
    <div
      lang={t.lang}
      className={`bv ${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: sealScript }} />

      <header className="bv-head">
        <a className="bv-name" href="#top">
          {profile.name}
        </a>
        <nav aria-label={t.nav.label} className="bv-nav">
          <a href="#work">{t.nav.work}</a>
          <a href="#how">{t.nav.how}</a>
          <a href="#about">{t.nav.about}</a>
          <span className="bv-lang" role="group" aria-label={t.langLabel}>
            {(["sv", "en"] as const).map((l, i) => (
              <span key={l}>
                {i > 0 && <span aria-hidden="true"> / </span>}
                {l === t.lang ? (
                  <span aria-current="page">{l.toUpperCase()}</span>
                ) : (
                  <a href={brevetPaths[l]} hrefLang={l} lang={l}>
                    {l.toUpperCase()}
                  </a>
                )}
              </span>
            ))}
          </span>
        </nav>
        <a className="bv-email" href={mailto}>
          {t.email}
        </a>
      </header>

      <main id="main">
        <section id="top" className="bv-hero">
          <Image
            className="bv-face"
            src={profile.photo.src}
            alt={t.photoAlt}
            width={profile.photo.width}
            height={profile.photo.height}
            sizes="(max-width: 640px) 72px, 104px"
            priority
          />
          <h1>
            {t.headline} <span className="bv-seek">{t.seeking}</span>
          </h1>
        </section>

        <div className="bv-wrap">
          <div className="bv-env bv-anim" aria-hidden="true">
            <div className="bv-env-back bv-anim" />
            <div className="bv-env-pocket bv-anim">
              <div className="bv-piece bv-piece-l">
                <div />
              </div>
              <div className="bv-piece bv-piece-r">
                <div />
              </div>
              <div className="bv-piece bv-piece-b">
                <div />
              </div>
              <div className="bv-env-skirt" />
            </div>
            <div className="bv-flap bv-anim">
              <div />
            </div>
            <Seal />
          </div>

          <div className="bv-sheet bv-anim">
            <section id="work" aria-labelledby="bv-work" className="bv-sec">
              <h2 id="bv-work">{t.workTitle}</h2>
              <ul className="bv-rows">
                {t.projects.map((p) => {
                  const v = video(p.slug);
                  return (
                    <li key={p.slug}>
                      <a className="bv-row" href={`/projects/${p.slug}`}>
                        <span className="bv-row-l">
                          <strong>{p.title}</strong>
                          <span>{p.sentence}</span>
                        </span>
                        {p.result ? (
                          <span className="bv-result">{p.result}</span>
                        ) : (
                          <span className="bv-desc">{p.description}</span>
                        )}
                      </a>
                      {v && (
                        <LazyDemo
                          summary={t.watchDemo}
                          label={p.videoLabel}
                          video={v}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section id="how" aria-labelledby="bv-how" className="bv-sec">
              <h2 id="bv-how">{t.how.title}</h2>
              <p>{t.how.intro}</p>
              <ol className="bv-principles">
                {t.how.principles.map((pr) => (
                  <li key={pr.title}>
                    <details>
                      <summary>{pr.title}</summary>
                      <p>
                        {pr.text}
                        {pr.link && (
                          <>
                            {" "}
                            <a href={pr.link.href}>{pr.link.label}</a>
                          </>
                        )}
                      </p>
                    </details>
                  </li>
                ))}
              </ol>
            </section>

            <section id="about" aria-labelledby="bv-about" className="bv-sec">
              <h2 id="bv-about">{t.about.title}</h2>
              <p>{t.about.text}</p>
              <dl className="bv-facts">
                {t.about.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section
              id="contact"
              aria-labelledby="bv-contact"
              className="bv-sec bv-contact"
            >
              <h2 id="bv-contact">{t.contact.title}</h2>
              <p>{t.contact.text}</p>
              <p>
                <a href={mailto}>{profile.links.email}</a>
              </p>
              <p className="bv-small">
                <a href={profile.links.linkedin}>LinkedIn</a> ·{" "}
                <a href={profile.links.github}>GitHub</a> ·{" "}
                <a href="/lab">Lab</a> ·{" "}
                <a href={repoUrl}>{t.contact.source}</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
