import { access, cp, mkdir, rm } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(scriptDir, "..");
const staticDir = join(rootDir, "storybook-static");

const frameworks = [
  {
    id: "angular",
    source: join(rootDir, "storybooks", "angular", "storybook-static"),
    target: join(staticDir, "angular"),
  },
  {
    id: "vue",
    source: join(rootDir, "storybooks", "vue", "storybook-static"),
    target: join(staticDir, "vue"),
  },
];

const ensureDirectory = async (directory) => {
  await mkdir(directory, { recursive: true });
};

const hasReadableDirectory = async (directory) => {
  try {
    await access(directory, constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const copyFrameworkStorybook = async ({ id, source, target }) => {
  const exists = await hasReadableDirectory(source);

  if (!exists) {
    throw new Error(
      `Expected Storybook output for "${id}" at ${source}. Run yarn build-storybook:${id} before composing.`,
    );
  }

  await ensureDirectory(staticDir);
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true });

  console.info(`[storybook][compose] Copied ${id} Storybook to ${target}`);
};

const run = async () => {
  await ensureDirectory(staticDir);

  for (const framework of frameworks) {
    await copyFrameworkStorybook(framework);
  }
};

run().catch((error) => {
  console.error("Failed to copy composed Storybook outputs:", error);
  process.exitCode = 1;
});
