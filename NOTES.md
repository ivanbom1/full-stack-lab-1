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