import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
await mkdir(new URL("../.cache/docs/", import.meta.url), { recursive: true });
for (let pass = 0; pass < 2; pass += 1) {
  const result = spawnSync("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", "-output-directory=.cache/docs", "docs/rendering.tex"], { cwd: root, stdio: "inherit" });
  if (result.error?.code === "ENOENT") {
    console.error("pdflatex was not found. Install a LaTeX distribution and add it to PATH.");
    process.exit(1);
  }
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("PDF: .cache/docs/rendering.pdf");
