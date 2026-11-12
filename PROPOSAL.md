# Project proposal

* Name: Ivan BOMKO
* Project title: EasyFrench
* Pitch (one sentence): Web application which has textual preparation excercises for TCF test.
* Target users: Students and people who want to come to France to work

## Pages

| URL | Content | Dynamic segment? | Rendering strategy and why |
|---|---|---|---|
| `/` | Landing page: what TCF is, what EasyFrench offers, link to topics and sign-up | No | **SSG**: the content is the same for everyone and rarely changes, so it's built once and loads fast |
| `/topics` | List of all topics (e.g. grammar, comprehension, writing), with a star button for logged-in users | No | **ISR** (e.g. revalidate every hour): the topic list changes rarely but should update without a full rebuild. The star button is a client component |
| `/topics/[topicId]` | One topic: its description and its list of exercises | Yes (`topicId`) | **SSG + ISR** with `generateStaticParams`: topics are known in advance and are the same for every user |
| `/exercises/[exerciseId]` | An exercise to fill in, the user's saved progress, and reviews from other users | Yes (`exerciseId`) | **SSR**: each user sees their own saved answers, so the page has to be rendered per request. Saving answers and posting a review use Server Actions |
| `/dashboard` | User's starred topics, exercises in progress and completed ones | No | **SSR**: personal data that needs authentication, so it can't be cached between users |
| `/account` | Account settings, with the option to delete the account | No | **SSR**: needs the logged-in user. Deleting runs through a Server Action |
| `/login`, `/register` | Authentication forms | No | **SSG** page with a client-side form: the page itself is static, and only the form needs interactivity |

## Data

Entities (2 to 4), their main fields, and how they are related:
- user
- execrice
- topic
- review

## Write actions

What users can create, update or delete:
they can get the exercises, modify templates into completed exercises (create or update it if they have stopped in the middle). they can delete topics they starred or their account.

## Repository

GitHub URL: [Repo](https://github.com/ivanbom1/EasyFrench.git)
