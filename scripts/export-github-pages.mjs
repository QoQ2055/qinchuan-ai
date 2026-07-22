import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const clientDir = join(rootDir, "dist", "client");
const outputDir = join(rootDir, "github-pages");
const basePath = "/qinchuan-ai";
const siteUrl = `https://qoq2055.github.io${basePath}/`;
const renderUrl = "https://qoq2055.github.io/";

async function rewriteCss(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteCss(filePath);
      continue;
    }
    if (extname(entry.name) !== ".css") continue;

    const css = await readFile(filePath, "utf8");
    await writeFile(filePath, css.replaceAll('url("/images/', `url("${basePath}/images/`));
  }
}

async function renderHomePage() {
  const workerUrl = pathToFileURL(join(rootDir, "dist", "server", "index.js"));
  workerUrl.searchParams.set("github-pages", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(renderUrl, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) throw new Error(`Unable to render GitHub Pages homepage: ${response.status}`);

  return (await response.text())
    .replaceAll(renderUrl, siteUrl)
    .replaceAll('href="/', `href="${basePath}/`)
    .replaceAll('src="/', `src="${basePath}/`)
    .replaceAll('content="/assets/', `content="${basePath}/assets/`);
}

if (!(await stat(clientDir)).isDirectory()) {
  throw new Error("Missing dist/client. Run the Vinext build before exporting GitHub Pages.");
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });
await rewriteCss(outputDir);
await writeFile(join(outputDir, "index.html"), await renderHomePage());
await writeFile(join(outputDir, ".nojekyll"), "");

console.log(`GitHub Pages bundle written to ${outputDir}`);
