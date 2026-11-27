import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovie, getMovies, parseId } from "@/lib/movies";;
import { ShortlistButton } from "@/components/shortlist-button";


// Only the ids returned by generateStaticParams exist: any other id is a 404
export const dynamicParams = false;

// SSG: runs at build time, one HTML page per movie (● in the build output)
export async function generateStaticParams() {
  const movies = await getMovies();
  return movies.map((movie) => ({ id: String(movie.id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/movies/[id]">): Promise<Metadata> {
  const id = parseId((await params).id);
  const movie = id === null ? undefined : await getMovie(id);
  if (!movie) return {};
  return { title: movie.title };
}

export default async function MoviePage({ params }: PageProps<"/movies/[id]">) {
  const id = parseId((await params).id);
  const movie = id === null ? undefined : await getMovie(id);
  if (!movie) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="mt-2">
        {movie.year} · {movie.genre} · {movie.minutes} min
      </p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Rendered at {new Date().toISOString()}
      </p>
      <ShortlistButton movieTitle={movie.title} />
      <Link href="/movies" className="mt-6 block w-fit underline">
        Back to all movies
      </Link>
    </main>
  );
}