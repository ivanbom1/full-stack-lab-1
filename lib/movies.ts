// Server-only: a Client Component that imports and uses this file fails the build.
// Type imports (import type { Movie }) are fine: they disappear at build.
import "server-only";

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

// Not prefixed with NEXT_PUBLIC_: only the server can read it.
// Start the API first: npm run api
const API_URL = process.env.MOVIES_API_URL ?? "http://127.0.0.1:4001";

// init: the fetch options chosen by the page, for example { cache: "no-store" }
export async function getMovies(init?: RequestInit): Promise<Movie[]> {
  const res = await fetch(`${API_URL}/api/movies`, init);
  if (!res.ok) throw new Error(`Movie API responded with ${res.status}`);
  return res.json();
}

// The id comes from the URL, so it is a string: "2", not 2
export async function getMovie(
  id: string,
  init?: RequestInit,
): Promise<Movie | undefined> {
  const res = await fetch(`${API_URL}/api/movies/${encodeURIComponent(id)}`, init);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Movie API responded with ${res.status}`);
  return res.json();
}

export async function getVotes(init?: RequestInit): Promise<VoteResults> {
  const res = await fetch(`${API_URL}/api/votes`, init);
  if (!res.ok) throw new Error(`Movie API responded with ${res.status}`);
  return res.json();
}