# web — mini twitter frontend

React 18 single-page client built with Vite and MUI v5. See the [root README](../README.md) for the
architecture and the API it consumes.

## Layout

| Path | What lives there |
|---|---|
| `src/api/client.js` | The single axios instance; base URL and bearer-token interceptor |
| `src/api/useFetch.js` | Shared fetch hook with loading, error and refetch |
| `src/auth/AuthContext.jsx` | Session state; `localStorage` is an implementation detail behind it |
| `src/pages/` | One component per route |
| `src/components/` | Layout, cards, follow button, feedback states |

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle
npm test             # 22 tests (Vitest)
npm run lint
```

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | Base URL of the Rails API |

Copy [.env.example](.env.example) to `.env` to override it.

## Routes

| Path | Component |
|---|---|
| `/` | Feed, with the composer when signed in |
| `/posts/:postId` | Post and its replies |
| `/users` | People |
| `/users/:userId` | Profile and that user's posts |
| `/users/:userId/followings` · `/followers` | Connection lists |
| `/login` · `/signup` | Auth |

`/followings` and `/followers` redirect to the signed-in user's own lists.

## Notes

- `react-hooks/exhaustive-deps` is an **error**, not a warning: a stale or unstable dependency is
  what caused the render loops in the original version of this app.
- Session state lives in `AuthContext`. Components never read `localStorage` directly, and nothing
  calls `window.location.reload()` to refresh the UI.
