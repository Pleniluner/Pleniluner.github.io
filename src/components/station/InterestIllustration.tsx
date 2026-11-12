/** A shared drawing scale keeps each subject legible beside its heading. */
export function InterestIllustration({ kind }: { kind: string }) {
  return <svg className="interest-illustration" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "p138" && <>
      <path className="interest-illustration__guide" d="M14 106h132M22 78a61 61 0 0 1 116 0" strokeDasharray="2 6" />
      <path d="m39 55 56-28 9 18-56 28zm49-24-4-8 15-7 16 32-15 7-4-8M41 58l-10 5 5 10 10-5M61 69l7 13h12l8-22M75 82v24m0-24-23 24m23-24 23 24" />
      <circle cx="75" cy="77" r="3" />
      <path className="interest-illustration__accent" d="M129 16v12m-6-6h12M19 32v6m-3-3h6" />
      <path className="interest-illustration__guide" d="M126 48a10 10 0 0 0 11 13 11 11 0 1 1-11-13Z" />
    </>}
    {kind === "p141" && <>
      <circle className="interest-illustration__guide" cx="112" cy="30" r="20" />
      <path d="M24 29q56 13 112 0l-3 9q-53 10-106 0Zm14 23h84v7H38zm13-9-5 59h9l5-58m40 0 5 58h9l-5-59M76 43v9m8-9v9M34 102h92M29 109h102" />
      <path className="interest-illustration__guide" d="m68 100 5-30h14l5 30M16 102h9m110 0h9M17 67l3-4m117 12 4 2" />
      <path className="interest-illustration__accent" d="M75 61q5 8 10 0m-5 5v10m-3-3 3 3 3-3" />
    </>}
    {kind === "p145" && <>
      <g className="interest-illustration__guide">
        <circle cx="116" cy="66" r="29" /><circle cx="116" cy="66" r="21" /><circle cx="116" cy="66" r="8" />
        <path d="m129 48 5 5m-38 24 5 5M18 109h128" />
      </g>
      <path d="M54 37V12h14v25m-16-9h18m-18-8h18M55 37c-15-7-30 6-24 20 4 8 8 10 2 17-16 17-10 33 10 36 11 2 25 2 36 0 20-3 26-19 10-36-6-7-2-9 2-17 6-14-9-27-24-20M50 90h22" />
      <circle cx="61" cy="64" r="10" /><path d="M59 28v63m4-63v63M49 14h5m14 0h5m-24 9h5m14 0h5" />
      <circle className="interest-illustration__accent" cx="116" cy="66" r="2" fill="currentColor" stroke="none" />
    </>}
    {kind === "p151" && <>
      <g className="interest-illustration__guide">
        <path d="m17 75 63-32 63 32-63 32Zm0 0v7l63 32 63-32v-7M33 67l63 32M49 59l63 32M64 51l63 32M127 67 64 99m47-40L48 91m48-40L33 83" />
      </g>
      <path d="M50 37v-9h9v7h8v-7h9v7h8v-7h9v9l-8 9v20l7 7v6H51v-6l7-7V46Zm8 9h27M58 66h27M51 73h41M64 51v10m7-10v10m7-10v10" fill="var(--interest-paper)" />
      <ellipse cx="111" cy="80" rx="8" ry="4" />
      <ellipse className="interest-illustration__accent" cx="96" cy="92" rx="6" ry="3" fill="currentColor" stroke="none" />
    </>}
  </svg>;
}
