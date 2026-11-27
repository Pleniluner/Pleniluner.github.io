"use client";
import { useLanguage } from "./i18n/LanguageProvider";
import { useRef } from "react";
import { StationImage } from "./StationImage";
import { AnniversaryVoicePlayer } from "./AnniversaryVoicePlayer";
import { IntroLoader } from "./IntroLoader";
import { ArtworkViewer } from "./ArtworkViewer";
import { ContactEmail } from "./ContactEmail";
import { SectionArtwork } from "./SectionArtwork";
import { ExpertiseDeck } from "./ExpertiseDeck";
import { SiteHeader } from "./SiteHeader";
import { Motion } from "./Motion";
import { Starfield } from "./Starfield";
import { MusicPlayer, type MusicPlayerControls } from "./MusicPlayer";
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


export default function Home() {
  const { t, locale } = useLanguage();
  const musicPlayer = useRef<MusicPlayerControls>(null);
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
      <a className="skip-link" href="#main">{t("s054")}</a>

      <SiteHeader />

      <main id="main" data-horizontal-track>
        <section
          className="hero horizontal-panel"
          id="top"
          aria-labelledby="hero-title"
          data-horizontal-panel
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
                <h1 id="hero-title" data-search-target><span>Pax omnibus.</span></h1>
                <p id="text-s056" data-search-target data-type-zh>{t("s056")}</p>
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
          data-panel-label={t("s058")}
          data-nav="about"
        >
          <div className="panel-frame about-primary about-art-layout">
            <ArtworkViewer />
            <div className="about-profile">
            <header className="section-header" data-reveal>
              <div>
                <h2 id="about-title" data-search-target>{t("s058")}</h2>
              </div>
              <p>{t(profile.tagline)}</p>
            </header>

            <div className="hero-intro">
              <ProfileBlocks blocks={[profile.sections.intro.blocks[0]]} />
              <p id="text-s061" data-search-target>{t("s061")}</p>
              <details className="about-name-details" data-reading-fold="name">
                <summary id="text-s062" data-search-target>{t("s062")}</summary>
                <div className="name-story">
                  <section className="name-story__thread">
                    <h3 id="note-name" data-search-target>Pleniluner</h3>
                    <ol className="name-story__path" lang="zh-CN" dir="ltr" role="list">
                      <li>盈月</li><li>银月</li><li>清月</li>
                    </ol>
                    <p id="text-s063" data-search-target>
                      {t("s063")}<a href="https://www.thwiki.cc/%E7%9B%88%E6%9C%88%E7%B4%80%E5%B9%B4%EF%BD%9EPlenilune_Annals" target="_blank" rel="noreferrer">{t("s064")}</a>{t("s065")}
                    </p>
                  </section>
                  <section className="name-story__thread">
                    <h3>Elysia</h3>
                    <p id="text-s066" data-search-target>
                      {t("s066")}<a href="https://music.apple.com/us/album/elysias-heart-feat-enzalla-single/1082112757" target="_blank" rel="noreferrer">Elysia&apos;s Heart</a>{t("s067")}
                    </p>
                    <a className="name-story__song" href="#elysias-heart-player" onClick={event => {
                      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
                        musicPlayer.current?.playElysiasHeart();
                      }
                    }}>{t("s106")} <bdi lang="en">Elysia’s Heart</bdi></a>
                  </section>
                </div>
              </details>
              <div className="about-biography-copy">
                <ProfileBlocks blocks={profile.sections.intro.blocks.slice(1)} />
              </div>
              <MusicPlayer ref={musicPlayer} />
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
          data-panel-label={t("s069")}
          data-nav="about"
        >
          <div id="anniversary-quote" className="quote-scene">
            <SectionArtwork src="images/starlight.jpg" credit="starlight" width={4642} height={2611} />
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
          data-panel-label={t("s077")}
          data-nav="now"
        >
          <SectionArtwork src="images/music-room.png" credit="musicRoom" width={3236} height={1700} />
          <div className="panel-frame">
            <header className="section-header" data-reveal>
              <div>
                <span className="section-kicker">{t("s077")}</span>
                <h2 id="now-title" data-search-target>{t(profile.sections.workbench.title)}</h2>
              </div>

            </header>

            <ProfileContent section="workbench" layout="rows" />
          </div>
          <PanelCoordinateLines mode="content" />
        </section>

        <ExpertiseDeck />

        <section
          className="interests section horizontal-panel"
          id="interests"
          aria-labelledby="interests-title"
          data-horizontal-panel
          data-panel-label={t("s083")}
          data-nav="interests"
        >
          <div className="panel-frame">
            <header className="section-header" data-reveal>
              <div>
                <span className="section-kicker">{t("s083")}</span>
                <h2 id="interests-title" data-search-target>{t(profile.sections.interests.title)}</h2>
              </div>
            </header>

            <ProfileContent section="interests" layout="grid" />
          </div>
          <PanelCoordinateLines mode="content" />
        </section>

        <section
          className="gear-panel section horizontal-panel illustrated-section"
          id="gear"
          aria-labelledby="gear-title"
          data-horizontal-panel
          data-panel-label={t("s085")}
          data-nav="gear"
        >
          <SectionArtwork src="images/workstation.jpg" />
          <div className="panel-frame gear" data-reveal>
            <div className="gear-heading">
              <span className="section-kicker">{t("s085")}</span>
              <h2 id="gear-title" data-search-target>{t(profile.sections.devices.title)}</h2>
              {locale.startsWith("zh") && <p className="workstation-name" lang="en" dir="ltr">Pleniluner’s Workstation</p>}
              <div className="workstation-intro">
                <ProfileBlocks blocks={[profile.sections.devices.blocks[0]]} />
                <a href="#text-p135">{t("workstationSignal")}</a>
              </div>
            </div>
            <div className="profile-content workstation-details"><ProfileBlocks blocks={profile.sections.devices.blocks.slice(1)} /></div>
          </div>
          <PanelCoordinateLines mode="content" />
        </section>

        <section
          className="connect section horizontal-panel"
          id="contact"
          aria-label={t("s095")}
          data-horizontal-panel
          data-panel-label={t("s095")}
          data-nav="contact"
        >
          <div className="panel-frame connect-frame">
              <div className="connect-links" data-reveal>
                <p className="section-kicker connect-kicker">{t("s095")}</p>
                <ContactEmail address="Pleniluner@outlook.com" />

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
          <PanelCoordinateLines mode="content" />
        </section>
      </main>
    </div>
  );
}
