/** The primary contour is traced on entry. The smaller construction marks stay secondary. */
function Outline({ d }: { d: string }) {
  return <path className="interest-illustration__outline" pathLength="1" fillRule="evenodd" d={d} />;
}

function Telescope() {
  return <>
    <g className="interest-illustration__guide interest-illustration__fine">
      <path d="m18 46 10-15 16-6" strokeDasharray="2 4" />
      <circle cx="28" cy="31" r="1.7" />
      <path d="M30 107h16m64 0h18" />
    </g>
    <g fill="var(--drawing-face)">
      <path d="m68 77 6 1-25 28h-5Zm9 1 6-1 24 29h-5Z" />
      <path d="M73 78h4v23h-4z" />
      <path d="m62 54 7-3 5 9 10-13 5 4-12 20-9-4Z" />
      <circle cx="75" cy="66" r="6" />
      <path d="M71 72h8l5 7H66z" />
    </g>
    <path className="interest-illustration__detail" d="m57 93 18-7 17 7" />
    <circle cx="75" cy="66" r="1.7" fill="currentColor" stroke="none" />
    <g transform="translate(32 65) rotate(-26)">
      <g className="interest-illustration__detail" fill="var(--drawing-face)">
        <path d="M35-11v-4m17 4v-4M30-19h28v5H30z" />
      </g>
      <Outline d="M0-5h12l6-5h48v-4h30c3 0 5 5 5 14s-2 14-5 14H66v-4H18l-6-5H0Z" />
      <g className="interest-illustration__detail">
        <path d="M15-7V7m48-17v20m8-24v28" />
        <ellipse cx="96" cy="0" rx="4.2" ry="13" fill="var(--drawing-shadow)" />
        <path className="interest-illustration__fine" d="M4-5V5m4-10V5m16-11h30" />
      </g>
      <path className="interest-illustration__accent" d="M96-8q2 6 .4 12" />
    </g>
    <path className="interest-illustration__accent" fill="currentColor" stroke="none" d="m137 10 1.7 4.9 4.9 1.7-4.9 1.7-1.7 4.9-1.7-4.9-4.9-1.7 4.9-1.7Z" />
  </>;
}

function ShrineGate() {
  return <>
    <g className="interest-illustration__guide">
      <circle cx="113" cy="24" r="16" fill="var(--drawing-wash)" />
      <path className="interest-illustration__fine" d="M113 12a12 12 0 0 1 10 5M18 103h18m88 0h16m-89 5h58" />
    </g>
    <Outline d="M18 23q62 17 124 0l-5 10q-12 4-24 6l1.5 11H128v7h-12.5l5.5 41h-10l-6-41H55l-6 41H39l5.5-41H32v-7h13.5L47 39q-12-2-24-6Zm39 18-1 9h19v-7.3Q66 42.5 57 41Zm28 1.7V50h19l-1-9q-9 1.5-18 1.7Z" />
    <g className="interest-illustration__detail">
      <path d="M23 31q57 17 114 0M34 53.5h92" />
      <path d="M52 59q28 16 56 0" />
      <path className="interest-illustration__fine" d="m43 94 4-30m69 30-4-30M72 60l-2 4m15-3-2 5m13-7-2 5" />
    </g>
    <g className="interest-illustration__accent" fill="currentColor" stroke="none">
      <path transform="translate(65 65) rotate(8)" d="M0 0h3.8v5.5H1v5h-3v4h-3v-7h3v-5h2Z" />
      <path transform="translate(94 65) rotate(-10)" d="M0 0h3.8v5.5H1v5h-3v4h-3v-7h3v-5h2Z" />
    </g>
    <g fill="var(--drawing-wash)">
      <path d="M38 97h12v6H36zm72 0h12l2 6h-14z" />
    </g>
  </>;
}

function GuitarAndRecord() {
  return <>
    <g className="interest-illustration__guide">
      <circle cx="109" cy="76" r="28" fill="var(--drawing-face)" />
      <path d="M86 72a23 23 0 0 1 17-18m28 25a22 22 0 0 1-15 17" />
      <path className="interest-illustration__fine" d="M91 70a18 18 0 0 1 11-11m22 24a17 17 0 0 1-7 7M25 107h20" />
    </g>
    <circle className="interest-illustration__accent" cx="109" cy="76" r="7" fill="var(--drawing-wash)" />
    <circle cx="109" cy="76" r="1.6" fill="currentColor" stroke="none" />
    <g transform="translate(4 5) scale(.94) rotate(23 68 63)">
      <Outline d="M62 42V24l-3-5 1-13q6-3 13 0l.5 13-3.5 5v18c7-5 15 0 15 8 0 7-6 11-4 17 2 5 13 10 13 22 0 13-11 21-26 21s-28-8-28-21c0-11 9-17 12-23 2-6-4-10-3-17 1-8 8-11 13-7Z" />
      <g className="interest-illustration__detail">
        <path d="M62.5 24h7L71 52h-9.5Z" fill="var(--drawing-shadow)" />
        <path d="M60 10h-3m3 5h-3m3 5h-3m16-10h4m-4 5h4m-4 5h4" />
        <circle cx="66.4" cy="64" r="7.2" fill="var(--drawing-shadow)" />
        <path d="M55 87q11 2 23 0l-1 5H56Z" fill="var(--drawing-wash)" />
        <path d="M65 51v37m3-37 .5 37" />
        <g className="interest-illustration__fine">
          <circle cx="66.4" cy="64" r="10" />
          <path d="m63 12 2 12v27m6-36-3 9v27" strokeWidth=".9" />
          <path d="M63 29h6m-6 5h7m-7 5h7m-7 5h7m-7 4h7" />
        </g>
      </g>
      <path d="M77 63c5 2 5 8-1 14-2 2-5 3-7 2 4-4 7-9 8-16Z" stroke="none" fill="var(--drawing-wash)" />
    </g>
  </>;
}

function ChessKnight() {
  return <>
    <g className="interest-illustration__guide">
      <path d="m15 82 65-25 65 25v5l-65 26-65-26Z" fill="var(--drawing-face)" />
      <path d="m16 82 21-8 21 8.3-21 8.4Zm42.7 17.3L80 91l21.3 8.5L80 107.8Z" fill="var(--drawing-wash)" stroke="none" />
      <path d="m15 82 65 26 65-26m-65 26v5" />
      <path d="m37 74 65 25M59 65l64 26m-86 0 65-26M59 99l64-25" />
    </g>
    <Outline d="M49 84c7-8 13-19 16-29-5 2-9 5-13 9l-5 2.5q-3 1.5-5.8-1L37 61q-3-3-.2-5.8l7.9-7.4c3.8-4 4.2-8.1 8-12.6 3-3.6 6.7-6.6 11.8-9.1l-.7-9q4.9 1.4 8.3 6 3.6-3.3 5.3-9.6 4.6 4.8 3.8 11.2c13.2 3.4 22.3 14.7 24.9 28.2 2.1 11.2-.2 22.8-5.1 31.1Z" />
    <g className="interest-illustration__detail">
      <path d="M80 31c12 6 18 16 17 29-.3 7-2.5 14-5.5 19M64 55q9-5 12-15" />
      <path className="interest-illustration__fine" d="m88 30-1 5m8-1-2 6m8 0-4 6M40 60q3 1 6-1.5" />
    </g>
    <path d="M57.5 39q4-2.8 8-2.6l-3.2 3.7Z" fill="currentColor" stroke="none" />
    <path d="M51 83h48l4 6H47Zm-4 6h56l4 6H43Z" fill="var(--drawing-wash)" />
    <g className="interest-illustration__accent">
      <path d="M114 79v2.5c0 4.5 18 4.5 18 0V79" fill="var(--drawing-wash)" />
      <ellipse cx="123" cy="79" rx="9" ry="3.4" fill="var(--drawing-face)" />
    </g>
  </>;
}

const illustrations = {
  p138: Telescope,
  p141: ShrineGate,
  p145: GuitarAndRecord,
  p151: ChessKnight,
};

export function InterestIllustration({ kind }: { kind: string }) {
  if (!Object.hasOwn(illustrations, kind)) return null;
  const Drawing = illustrations[kind as keyof typeof illustrations];
  return (
    <svg className="interest-illustration" data-reveal="drawing" viewBox="0 0 160 120"
      fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      <Drawing />
    </svg>
  );
}
