"use client";
import { useLanguage } from "./i18n/LanguageProvider";
import { StationImage } from "./StationImage";
import { AnniversaryVoicePlayer } from "./AnniversaryVoicePlayer";
import { ScrollNavigation } from "./ScrollNavigation";
import { IntroLoader } from "./IntroLoader";
import { ArtworkViewer } from "./ArtworkViewer";
import { SectionArtwork } from "./SectionArtwork";
import { ExpertiseDeck } from "./ExpertiseDeck";
import { SiteHeader } from "./SiteHeader";
import { Motion } from "./Motion";
import { SceneTransitions } from "./SceneTransitions";
import { Starfield } from "./Starfield";
import { MusicPlayer } from "./MusicPlayer";
import { ProfileBlocks, ProfileContent, profile } from "./ProfileContent";

function PanelCoordinateLines({ mode }: { mode: "home" | "content" }) {
  return (
    <div className={`panel-coordinate-lines panel-coordinate-lines--${mode}`} aria-hidden="true">
      <span className="panel-coordinate-lines__line panel-coordinate-lines__line--vertical" />
      <span className="panel-coordinate-lines__line panel-coordinate-lines__line--top" />
      <span className="panel-coordinate-lines__line panel-coordinate-lines__line--bottom" />
    </div>
  );
}

function PanelTelemetry({
  index,
  code,
  metrics,
}: {
  index: string;
  code: string;
  metrics: [string, string, string];
}) {
  return (
    <div className="panel-telemetry" aria-hidden="true">
      <div className="panel-telemetry__section">
        <span>SECTION</span>
        <strong>{index}</strong>
      </div>

      <div className="panel-telemetry__coordinates">
        {metrics.map((metric, metricIndex) => (
          <span key={metric}>
            <i>{["X", "Y", "Z"][metricIndex]}</i>
            {metric}
          </span>
        ))}
      </div>

      <svg className="panel-telemetry__orbit" viewBox="0 0 420 300" focusable="false">
        <ellipse cx="212" cy="156" rx="174" ry="82" />
        <ellipse cx="212" cy="156" rx="116" ry="55" />
        <circle cx="212" cy="156" r="54" />
        <circle cx="212" cy="156" r="35" />
        <circle cx="212" cy="156" r="16" />
        <path d="M38 157H386M212 28V276" />
        <path className="panel-telemetry__orbit-dash" d="M55 182C120 66 300 40 384 142" />
        <circle className="panel-telemetry__orbit-node panel-telemetry__orbit-node--a" cx="61" cy="181" r="7" />
        <circle className="panel-telemetry__orbit-node panel-telemetry__orbit-node--b" cx="355" cy="98" r="5" />
        <circle className="panel-telemetry__orbit-core" cx="212" cy="156" r="6" />
      </svg>

      <div className="panel-telemetry__caption">
        <span>{code}</span>
        <span>CONTENT ORBIT / {index}</span>
      </div>

      <div className="panel-telemetry__baseline">
        {Array.from({ length: 13 }, (_, tick) => <i key={tick} />)}
        <span>{code}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, locale } = useLanguage();
const socialLinks = [
  ["GitHub", "https://github.com/Pleniluner"],
  ["Codeforces", "https://codeforces.com/profile/Pleniluner"],
  ["Hugging Face", "https://huggingface.co/Pleniluner"],
  ["Bilibili", "https://space.bilibili.com/289448606"],
  ["Behance", "https://www.behance.net/Plenilune"],
  ["Zhihu", "https://www.zhihu.com/people/Pleniluner"],
  ["QRZ", "https://www.qrz.com/db/BG7LBJ"],
  ["Steam", "https://steamcommunity.com/id/Plenilunel"],
  ["Stack Overflow", "https://stackoverflow.com/users/32458790/Pleniluner"],
];


  return (
    <div className="site-shell station-home">
      <IntroLoader />
      <Motion />
      <SceneTransitions />
      <ScrollNavigation />
      <a className="skip-link" href="#main">{t("s054")}</a>

      <SiteHeader />

      <main id="main" data-horizontal-track>
        <section
          className="hero horizontal-panel"
          id="top"
          aria-labelledby="hero-title"
          data-horizontal-panel
          data-panel-number="01"
          data-panel-label={t("s055")}
          data-nav="top"
          data-tone="dark"
        >
          <div className="hero-title-stage">
            <div className="hero-art" aria-hidden="true">
              <StationImage src="images/kaguya.png" alt="" loading="eager" fetchPriority="high" sizes="max(100vw, 206vh)" />
            </div>
            <Starfield />
            <div className="hero-title-lockup">
              <div className="hero-quote">
                <h1 id="hero-title"><span>Pax omnibus.</span></h1>
                <p data-type-zh>{t("s056")}</p>
              </div>
            </div>
          </div>
          <PanelCoordinateLines mode="home" />
        </section>

        <section
          className="about-panel section horizontal-panel"
          id="about"
          aria-labelledby="about-title"
          data-horizontal-panel
          data-tone="dark"
          data-panel-number="02"
          data-panel-label={t("s058")}
          data-nav="about"
        >
          <div className="panel-frame about-primary about-art-layout">
            <ArtworkViewer />
            <div className="about-profile">
            <header className="section-header" data-reveal>
              <div>
                <span className="section-kicker">02 / {t("s058")}</span>
                <h2 id="about-title">{t("s058")}</h2>
              </div>
              <p>{t(profile.tagline)}</p>
            </header>

            <div className="hero-intro">
              <ProfileBlocks blocks={[profile.sections.intro.blocks[0]]} />
              <p>{t("s061")}</p>
              <details className="about-name-details">
                <summary>{t("s062")}</summary>
              <p>
                {t("s063")}<a href="https://www.thwiki.cc/%E7%9B%88%E6%9C%88%E7%B4%80%E5%B9%B4%EF%BD%9EPlenilune_Annals" target="_blank" rel="noreferrer">{t("s064")}</a>{t("s065")}</p>
              <p>
                {t("s066")}<a href="https://music.apple.com/us/album/elysias-heart-feat-enzalla-single/1082112757" target="_blank" rel="noreferrer">Elysia&apos;s Heart</a>{t("s067")}</p>
              </details>
              <div className="about-biography-copy">
                <ProfileBlocks blocks={profile.sections.intro.blocks.slice(1)} />
              </div>
              <MusicPlayer />
            </div>
            </div>
          </div>
          <PanelCoordinateLines mode="content" />
        </section>

        <section
          className="about-panel about-panel--continuation section horizontal-panel"
          id="about-notes"
          aria-label={t("s073")}
          data-horizontal-panel
          data-direct-page
          data-panel-number="02"
          data-panel-label={t("s069")}
          data-nav="about"
        >
          <div id="anniversary-quote" className="quote-scene">
            <SectionArtwork src="images/starlight.jpg" complete width={4642} height={2611} />
            <div className="design-credo" data-reveal aria-label={t("s073")}>
              <AnniversaryVoicePlayer />
            </div>
          </div>
          <PanelCoordinateLines mode="content" />
        </section>

        <section
          className="now section horizontal-panel illustrated-section"
          id="now"
          aria-labelledby="now-title"
          data-horizontal-panel
          data-panel-number="03"
          data-panel-label={t("s077")}
          data-nav="now"
        >
          <SectionArtwork src="images/music-room.png" complete width={3236} height={1700} />
          <div className="panel-frame">
            <header className="section-header" data-reveal>
              <div>
                <span className="section-kicker">03 / {t("s077")}</span>
                <h2 id="now-title">{t(profile.sections.workbench.title)}</h2>
              </div>

            </header>

            <ProfileContent section="workbench" layout="rows" />
          </div>
          <PanelTelemetry index="03" code="CURRENT / ACTIVE" metrics={["06 THREADS", "IN PROGRESS", "UTC+08"]} />
          <PanelCoordinateLines mode="content" />
        </section>

        <ExpertiseDeck />

        <section
          className="interests section horizontal-panel"
          id="interests"
          aria-labelledby="interests-title"
          data-horizontal-panel
          data-panel-number="05"
          data-panel-label={t("s083")}
          data-nav="interests"
        >
          <div className="panel-frame">
            <header className="section-header" data-reveal>
              <div>
                <span className="section-kicker">08 / {t("s083")}</span>
                <h2 id="interests-title">{t(profile.sections.interests.title)}</h2>
              </div>
            </header>

            <ProfileContent section="interests" layout="grid" />
          </div>
          <PanelTelemetry index="05" code="INTERESTS / ORBIT" metrics={["04 ORBITS", "MIXED MEDIA", "PERSONAL"]} />
          <PanelCoordinateLines mode="content" />
        </section>

        <section
          className="gear-panel section horizontal-panel illustrated-section"
          id="gear"
          aria-labelledby="gear-title"
          data-horizontal-panel
          data-panel-number="06"
          data-panel-label={t("s085")}
          data-nav="gear"
        >
          <SectionArtwork src="images/workstation.jpg" />
          <div className="panel-frame gear" data-reveal>
            <div className="gear-heading">
              <span className="section-kicker">09 / {t("s085")}</span>
              <h2 id="gear-title">{t(profile.sections.devices.title)}</h2>
              {locale.startsWith("zh") && <p className="workstation-name" lang="en" dir="ltr">Pleniluner’s Workstation</p>}
              <div className="workstation-intro"><ProfileBlocks blocks={[profile.sections.devices.blocks[0]]} /></div>
            </div>
            <div className="profile-content workstation-details"><ProfileBlocks blocks={profile.sections.devices.blocks.slice(1)} /></div>
          </div>
          <PanelTelemetry index="06" code="EQUIPMENT / ARRAY" metrics={["06 ITEMS", "CREATIVE TOOLS", "IN USE"]} />
          <PanelCoordinateLines mode="content" />
        </section>

        <section
          className="connect section horizontal-panel"
          id="contact"
          aria-label={t("s095")}
          data-horizontal-panel
          data-panel-number="08"
          data-panel-label={t("s095")}
          data-nav="contact"
        >
          <div className="panel-frame connect-frame">
              <div className="connect-links" data-reveal>
                <p className="section-kicker connect-kicker">11 / {t("s095")}</p>
                <a className="connect-email" href="mailto:Pleniluner@outlook.com">
                  Pleniluner@outlook.com
                </a>

                <nav className="social-list" aria-label={t("s099")}>
                  {socialLinks.map(([label, href], index) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer" data-reveal="line">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{label}</strong>
                      <i aria-hidden="true" />
                    </a>
                  ))}
                </nav>
              </div>

            <p className="profile-goodbye" lang="la" dir="ltr">{t(profile.closing)}</p>
            <footer className="site-footer" dir="ltr">
              {/* deslop-ignore-next-line 15 — copyright mark, not decorative emoji */}
              <span>© 2026 Pleniluner</span>
              <span lang="la">Pax omnibus.</span>
            </footer>
          </div>
          <PanelTelemetry index="08" code="CONTACT / SIGNAL" metrics={["07 LINKS", "EMAIL", "ONLINE"]} />
          <PanelCoordinateLines mode="content" />
        </section>
      </main>
    </div>
  );
}
