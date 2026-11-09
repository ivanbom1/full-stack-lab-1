# Q&A

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