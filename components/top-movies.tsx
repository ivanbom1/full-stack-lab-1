import Link from "next/link";
import { getMovies, getVotes } from "@/lib/movies";

// Fixed locale and time zone: the output does not depend on the machine
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeStyle: "medium",
  timeZone: "Europe/Paris",
});

// Async Server Component: it calls the data layer directly, not /api/votes.
// The two reads do not depend on each other: start them together.
export async function TopMovies() {
  const [movies, { votes, countedAt }] = await Promise.all([getMovies(), getVotes()]);
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
