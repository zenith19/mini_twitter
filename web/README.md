# mini_twitter_react

A single-page Twitter-style frontend built with **React** (Create React App). It consumes the [mini_twitter](https://github.com/zenith19/mini_twitter) Rails API and provides the user-facing flow: sign up, log in, browse a feed, view profiles, post, comment, and follow other users.

This is the frontend half of a full-stack learning project — the Rails API backend lives in [mini_twitter](https://github.com/zenith19/mini_twitter).

## Stack

- **React** 16.13 with **react-scripts** 3.4.3 (Create React App)
- **react-router-dom** v5 for client-side routing
- **axios** for HTTP calls to the Rails API
- **Material-UI** v4 (`@material-ui/core`) + **reactstrap / Bootstrap 4** for UI
- **react-hook-form** for form handling and validation
- Session token persisted in `localStorage`
- Functional components with hooks (`useState`, `useEffect`, `useHistory`, `useForm`)

## Features

- **Auth** — sign up, log in, and log out.
- **Conditional navigation** — the sidebar adapts to auth state: logged-out users see *Sign Up / Log in*, logged-in users see *Following / Followers*.
- **Feed** — the home page lists all posts newest-first, with a create-post box at the top.
- **Posts & comments** — create a post, open a single post with its comments, and comment when logged in.
- **Users** — browse the user list and open a profile showing that user's posts.
- **Social graph** — follow / unfollow users and view your followings and followers.
- **Layout** — a Material-UI `Grid` shell with header, sidebar, and main body.

## Session handling

On login, the app POSTs to `/v1/sessions` and stores the API response — including the `authentication_token` — in `localStorage` under the `loginData` key. That token is sent in the `token` header on authenticated requests (create post, comment, follow). Logging out clears `localStorage`.

## Routes

| Path | Component | View |
|------|-----------|------|
| `/` | `Posts` | Posts feed |
| `/posts/:postId` | `FullPost` | Single post + comments |
| `/users` | `Users` | User list |
| `/users/:userId` | `Profile` | User profile |
| `/signup` | `SignUp` | Sign up |
| `/login` | `Login` | Log in |
| `/logout` | `Logout` | Log out |
| `/followings` | `Followings` | Users you follow |
| `/followers` | `Followers` | Your followers |
| `/follow/:followingUserId` | `Follow` | Follow a user |

## Getting started

Prerequisites: Node.js, and the `mini_twitter` API running on port 3001.

```bash
yarn install && yarn start
```

This opens `http://localhost:3000`. The app talks to the API at `http://localhost:3001`, so start the [backend](https://github.com/zenith19/mini_twitter) with `rails server -p 3001` first.

### Available scripts

| Action | Command |
|--------|---------|
| Run dev server | `yarn start` |
| Production build | `yarn build` |
| Run tests | `yarn test` |

## Notes

Built as a learning project to practice consuming a REST API from a React SPA with token auth and client-side routing. A few honest caveats:

- The API base URL is hard-coded to `http://localhost:3001` across components — it would need to move to an environment variable before deploying anywhere.
- Auth is inferred from the presence of `loginData` in `localStorage`; there are no protected-route guards.
- The only test is the default Create React App scaffold, which no longer matches the app.

**Possible improvements**

- Move the API base URL to an environment variable and use a shared axios instance that attaches the token automatically.
- Add protected routes that redirect unauthenticated users away from logged-in-only pages.
- Replace the post-login `window.location.reload()` with React state/context so the UI updates without a full reload.
- Add real component/integration tests in place of the default scaffold.
