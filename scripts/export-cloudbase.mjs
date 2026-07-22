import { cp, mkdir, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const clientDir = join(rootDir, "dist", "client");
const outputDir = join(rootDir, "cloudbase-static");
const renderUrl = "https://resume.local/";

async function renderHomePage() {
  const workerUrl = pathToFileURL(join(rootDir, "dist", "server", "index.js"));
  workerUrl.searchParams.set("cloudbase", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(renderUrl, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) throw new Error(`Unable to render CloudBase homepage: ${response.status}`);

  return (await response.text()).replaceAll(renderUrl, "/");
}

if (!(await stat(clientDir)).isDirectory()) {
  throw new Error("Missing dist/client. Run the Vinext build before exporting CloudBase.");
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });
await writeFile(join(outputDir, "index.html"), await renderHomePage());

console.log(`CloudBase static bundle written to ${outputDir}`);
