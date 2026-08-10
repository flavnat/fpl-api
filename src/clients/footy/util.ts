import { Client, fetch, interceptors } from "undici";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";

export async function saveUrlToFile(
  url: string,
  filePath: string,
): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: ${response.status} ${response.statusText}`,
    );
  }

  if (!response.body) {
    throw new Error("Response has no body");
  }

  await pipeline(
    response.body as unknown as NodeJS.ReadableStream,
    createWriteStream(filePath),
  );
}

