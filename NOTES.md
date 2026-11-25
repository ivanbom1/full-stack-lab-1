# Q&A Lab 1

## In which file are the <html> and <body> tags?
- In the app/layout.tsx

## Which file renders the page at /?
- app/page.tsx

## Which folder is for images and other static files, and how do you reference them?
- public/

## What is tsconfig.json doing in your project?
- tsconfig.json is a TypeScript configuration json file

## What does @/* mean in tsconfig.json? Write an import that uses it.
- In a tsconfig.json file, @/* is a path alias configuration used to create a shortcut for importing files
- import { Button } from '@/components/Button';

## What does app/layout.tsx import from next/font/google, and what does Next.js do with it at build time?
- app/layout.tsx imports a google font from dir.
- the font is getting loaded at a build time.

## What’s the difference between layout.tsx and page.tsx?
- page.tsx loads html homepage of the webapp
- layout.tsx defines supporting functions

## Where would you put a navbar that appears on every page?
- on top or on the right side

## What is globals.css for, and where is it imported?
- it is used to define all the global class-names used in styling the website
- it is imported to layout.tsx

## What is AGENTS.md, and does your app need it to run?
- it is a basic MCP placeholder file for Agentic AI development
- an application doesn't need it to run

# Q&A Lab 2

## In the page source, are the movie titles present for /movies? For /movies-client? Why?
- for /movies - yes. for /movie-client - no
- It awaits getMovies() on the server and renders the full list to HTML before sending the response, so the titles as an "Inception example" are already in the source.

## Without the force-dynamic line of Part E, you run npm run build again tomorrow, then npm start, without changing anything else. What does the "Rendered at" timestamp of /movies show, and why?
- during build, Next.js prerenders every static route, so that MoviesPage() runs again. That implies generating a new timestamp.

## Part E made every request to /movies about one second slower. Give one situation where force-dynamic is still the right choice, and explain why.
- The data changes all the time and must be current. If the page were static, it would show the counts from build time forever. Everyone would see stale results until the next deploy.

## A classmate sees [movies] rendered 6 movies in the browser console and says: "So this code runs in the browser." What do you answer, and how can you prove it?
- disable JavaScirpt and reload, "rendered 6 movies" will appear in the server terminal

## Which version would you choose for a public movie catalogue that changes once a week, and why?
- scheduled changes give credit to the static server rendering, as we don't have a need to show current data and slow down every request by rendering.

# Q&A Lab 3

## NavLink uses usePathname, a hook that only works in Client Components. Yet the page source of /movies/2 already contains aria-current="true" on the Movies link. How is this possible?
- "use client" does not mean “rendered only in the browser”. A Client Component is rendered on the server too, to produce the initial HTML, and is then hydrated in the browser. While it renders on the server, usePathname() reads the path that Next.js already knows for the page being rendered:
    - under npm run dev, that’s the path of the incoming request;
    - after npm run build, it’s the path of each page built from generateStaticParams, such as /movies/2.

## Why does generateStaticParams return String(movie.id) and not movie.id? And why does /movies/42 give a 404 in Part C without running the code of the page?
- Route params come from the URL, and a URL is text. In /movies/2 the segment is the string "2", not the number 2. That’s why params is typed as { id: string } in PageProps<"/movies/[id]">.
- dynamicParams = false tells Next.js that the list from generateStaticParams is complete. At build time it records the valid paths, /movies/1 to /movies/6. When a request for /movies/42 arrives, the server finds no matching path and answers 404 right away. MoviePage never runs, so getMovie isn’t called, the 1-second delay doesn’t happen, and notFound() is never reached. The server sends the 404 page instead.

## In Part D, why is the note kept between /movies and /movies/2, and lost when you go through /about?
- The note survives because a layout stays mounted while you navigate between the pages it wraps. It’s lost because leaving the section unmounts that layout. **/movies → /movies/2 → /movies** works, but **/movies → /about → /movies** doesn't.

## In Part E, step 4, where is the real message of the error, and why does Next.js not send it to the browser?
- The real message is in the terminal running npm start. The server logs the original error, Movie database unavailable, with its stack trace.
- MoviesPage is a Server Component, so the error happens on the server. Server error messages can contain things a visitor should never see: database hostnames, SQL, file paths, sometimes credentials. Error messages can’t be checked for secrets automatically, so in production Next.js never sends a server error’s message to the browser.

## Under npm run dev, "Loading the movies..." appears when you open /movies/2. Under npm start it does not, but it still appears on /movies. Why?
- Every page is rendered on request, even those with generateStaticParams. Opening /movies/2 runs getMovie, which calls getMovies and its 1-second delay. While the server waits, Next.js shows the loading.tsx fallback (“Loading the movies...”) because the movie page sits inside app/movies/.
- /movies/2 was prerendered at build time (● in the table). Its result already exists, so getMovie doesn’t run. The page is served immediately, and the fallback has no time to appear. Link also prefetches static pages in production, so the page is often already in the browser before you click.

# Q&A Lab 4, part 1

## After npm run build with the API running, the terminal of the API shows 7 calls. Which calls are they? generateMetadata and the page of a movie both call getMovie: why does the API receive only one call for each movie?
- After npm run build with the API running, the API receives 7 calls. One is GET /api/movies, from getMovies() in generateStaticParams of /movies [id]: it gets the list of ids so Next.js knows which pages to prerender. The other six are GET /api/movies/1 to /api/movies/6, one getMovie(id) call for each prerendered movie page (the ● routes). /movies is dynamic (ƒ), so the build does not render it and does not call the API for it.
- **generateMetadata** and the page both call getMovie(id), but the API receives only one call per movie because of request memoization. During one render of a route, Next.js remembers each fetch with the same URL and options.

## In break 3, where did the value of MOVIES_API_KEY end up, who can read it, and where should the key be used instead?
- In break 3, the value abc123 ended up in the HTML of the prerendered movie pages (.next/server/app/movies/...), not in the JavaScript in .next/static. A Client Component is also rendered on the server, during the build here, and on the server every variable in .env.local exists, so the key was written into the page as text. That HTML is sent to every visitor, so anyone can read it.
- The key should be used only in server-only code, in lib/movies.ts next to MOVIES_API_URL, in a header of the fetch to the API. That file has import "server-only", so a Client Component can’t use it.

## Explain in your own words why Next.js refuses a function as a prop (break 1) and a server-only import in a Client Component (break 2).
- The movie page is a Server Component and it runs on the server but ShortlistButton runs in the browser. To give the button its props, Next.js writes them into the RSC payload, which can only hold data that can be serialized: strings, numbers, arrays, objects. A function is code that lives in the server’s memory, so it can’t be written into the payload, even an empty one like () => {}. Next.js therefore stops the build.
- Break 2, a server-only import: Everything a Client Component imports and uses is bundled into the JavaScript sent to the browser. lib/movies.ts is server code: it reads process.env.MOVIES_API_URL and calls an API that only the server can reach. In the browser it wouldn’t work, and it would expose server code and addresses. import "server-only" turns this mistake into a build error instead of a hidden bug. With only the import and no call and the build passes, because the unused import is dropped and nothing goes into the bundle.

# Lab 4, part 2

| Page | `fetch` option | Build output you expect | Real build output | Strategy | Why it fits the page |
|---|---|---|---|---|---|
| `/movies` | `next: { revalidate: 10 }` | `○ /movies`, static (prerendered at build), with `10s` in the Revalidate column: ISR | `○ /movies`, `10s` revalidate, `1y` expire | ISR | The list of movies changes rarely, so a saved page is fast and survives an API outage, and it is still refreshed in the background at most every 10 s when a movie is added. |
| `/movies/[id]` | `cache: "force-cache"` | `● /movies/[id]`, SSG with `generateStaticParams`: one page per movie (`/movies/1`, `/movies/2`, ...) | `● /movies/[id]` with `/movies/1` to `/movies/6` | SSG | The details of a movie never change, so each page is built once at build time and served instantly, with no API call. |
| `/` | `cache: "no-store"` | `ƒ /` | `ƒ /` | SSR (with streaming) | The votes change all the time, so the page must be rendered on every request. `<Suspense>` sends the title at once and streams the slow list later. |
| `/movies-client` | none (fetched in the browser) | `○ /movies-client` | `○ /movies-client` | CSR | Only for comparison: the server sends a static shell and the browser fetches the movies in `useEffect`. The HTML has no titles, so it is worse for SEO and first display. |

## Part F: home page timings (`curl -w "%{time_starttransfer} %{time_total}"`)

| Version | First byte (s) | Total (s) |
|---|---|---|
| 1. No `<Suspense>`, two `await` one after the other | 2.613684 | 2.635622 |
| 2. With `<Suspense>` | 0.091391 | 2.60198 |
| 3. `<Suspense>` + `Promise.all` | 0.087174 | 1.589786 |

## Part H: when the API is down

| Page | What you see | Why, with the strategy of the page |
|---|---|---|
| `/movies` | The page with the list of movies, as if the API was running. | ISR: the page was generated during the build and saved on the server (in `.next`), not in the browser. Next.js serves that saved HTML. After 10 s, a request triggers a regeneration in the background; it fails because the API is down, so Next.js keeps serving the last good version. |
| `/movies/2` | The movie page, as if the API was running. | SSG: the page was generated once during the build (`generateStaticParams` + `force-cache`) and saved as HTML on the server. Next.js never calls the API for it again, so the API being down changes nothing. |
| `/` | This page couldn’t load. A server error occurred. Reload to try again. | SSR with streaming: the page is rendered on every request and `TopMovies` uses `cache: "no-store"`, so nothing is saved and the API is called each time. The title and "Counting the votes..." are sent first, with status 200. Then the fetch fails (`⨯ TypeError: fetch failed` in the app terminal). There is no error boundary (`error.tsx`) for `/`, so the error goes up to the root and Next.js replaces the whole page with its default error page. |
| `/movies-client` | Movies (client-rendered). The movies could not be loaded. Is the Movie API running? | CSR: the server only sends an empty shell with "Loading movies...". The browser then calls the API itself in `useEffect`; the call fails, so the `catch` shows the error message. Nothing was saved at build time. |

## Questions

### 1. Strategy of each page

See the table at the top of this section: `/movies` is ISR, `/movies/[id]` is SSG, `/` is SSR with streaming and `/movies-client` is CSR. The real build output matches my predictions for `/movies` and `/movies/[id]`. Each page gets its strategy only from the options it passes to `fetch`, without `export const dynamic` or `export const revalidate`.

### 2. The 8 calls of the build

With an empty `.next/cache`, nothing can be reused, so every fetch reaches the API. `/api/movies` is called twice: once by `generateStaticParams` (`force-cache`) and once by the page `/movies` (`revalidate: 10`). The options are different, so they are two different cache entries. Then `/api/movies/:id` is called once per movie, 6 times: `generateMetadata` and the page use the same URL and options, so Next.js sends one request for both. 2 + 6 = 8. The home page makes no call during the build because it is dynamic (`no-store`).

### 3. Suspense and Promise.all

Without `<Suspense>`, the server waits for both requests before sending anything: first byte and total were both about 2.6 s. `<Suspense>` improves only the first byte (0.09 s): the page and the fallback are sent at once and the list is streamed later in the same response, but the server still waits 2.5 s for the data, so the total stays about 2.6 s. `Promise.all` improves only the total (1.59 s): the two requests run at the same time, so the wait is the slowest one (1.5 s) instead of the sum. The first byte was already fast thanks to `<Suspense>`.

### 4. When the API is down

See the Part H table above.
