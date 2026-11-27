// Server-only: a Client Component that imports and uses this file fails the build.
// Type imports (import type { Movie }) are fine: they disappear at build.
// The pages and the Route Handlers call these functions on the server.
// In session 9, Prisma replaces the JSON files: only this file changes.
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  minutes: number;
};

export type Vote = {
  movieId: number;
  count: number;
};

export type VoteResults = {
  votes: Vote[];
  countedAt: string; // ISO 8601
};

// A slow database, to keep the loading states visible: DEMO_LATENCY_MS=0 turns it off
const LATENCY_MS = Number(process.env.DEMO_LATENCY_MS ?? 800);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Read on every call: edit a file in data/ and the next call sees it
async function read<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(path.join(process.cwd(), "data", file), "utf8"));
}

export async function getMovies(): Promise<Movie[]> {
  await wait(LATENCY_MS);
  return read<Movie[]>("movies.json");
}

// cache(): generateMetadata and the page read the file once per request
export const getMovie = cache(async (id: number): Promise<Movie | undefined> => {
  await wait(LATENCY_MS);
  return (await read<Movie[]>("movies.json")).find((movie) => movie.id === id);
});

export async function getVotes(): Promise<VoteResults> {
  await wait(LATENCY_MS);
  return { votes: await read<Vote[]>("votes.json"), countedAt: new Date().toISOString() };
}

// The id comes from the URL, so it is a string: "2" -> 2, "abc" or "2.5" -> null
export function parseId(value: string): number | null {
  return /^[1-9]\d*$/.test(value) ? Number(value) : null;
}