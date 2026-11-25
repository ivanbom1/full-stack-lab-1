import Link from "next/link";
import { getMovies, getVotes } from "@/lib/movies";

// Fixed locale and time zone: the output does not depend on the machine
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeStyle: "medium",
  timeZone: "Europe/Paris",
});

// Async Server Component: it fetches its own data on the server, without
// useEffect. No cache: the votes change all the time.
export async function TopMovies() {
  // The two requests do not depend on each other: start them together.
  // One after the other: 1 s + 1.5 s = 2.5 s. Together: 1.5 s.
  const [movies, { votes, countedAt }] = await Promise.all([
    getMovies({ cache: "no-store" }),
    getVotes({ cache: "no-store" }),
  ]);

  const top = [...votes].sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <>
      <ol className="mt-3 list-decimal space-y-1 pl-6">
        {top.map((vote) => (
          <li key={vote.movieId}>
            <Link href={`/movies/${vote.movieId}`} className="underline underline-offset-4">
              {movies.find((movie) => movie.id === vote.movieId)?.title}
            </Link>
            : {vote.count} votes
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Votes counted at {timeFormat.format(new Date(countedAt))}
      </p>
    </>
  );
}
