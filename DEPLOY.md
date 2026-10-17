# Deploying mini twitter

Three free services, none of which expire:

| Piece | Host | Why |
|---|---|---|
| PostgreSQL | **Neon** | Free tier does not expire. Render's free Postgres is deleted after 30 days. |
| Rails API | **Render** (free web service) | Free, 750 instance-hours/month, reads `PORT`. |
| React client | **Cloudflare Pages** | Unmetered static assets, no commercial-use restriction. |

Total: **$0/month.** The one real cost is latency — see [Cold starts](#cold-starts).

---

## 1. Database — Neon

1. Sign up at [neon.com](https://neon.com) and create a project (pick the region closest to you).
2. Copy the **connection string**. It looks like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
   Keep `?sslmode=require` — Neon rejects unencrypted connections.

Nothing else to do; the Rails side creates its own tables on first deploy.

## 2. API — Render

1. Sign up at [render.com](https://render.com) and connect your GitHub account.
2. **New → Web Service**, pick the `mini_twitter` repo.
3. Settings:

   | Field | Value |
   |---|---|
   | Root Directory | `api` |
   | Runtime | Ruby |
   | Build Command | `./bin/render-build.sh` |
   | Start Command | `bundle exec puma -C config/puma.rb` |
   | Health Check Path | `/up` |
   | Instance Type | Free |

4. Environment variables:

   | Key | Value |
   |---|---|
   | `RAILS_ENV` | `production` |
   | `BUNDLE_WITHOUT` | `development:test` |
   | `DATABASE_URL` | the Neon connection string |
   | `SECRET_KEY_BASE` | generate one: `openssl rand -hex 64` |
   | `CORS_ORIGINS` | *leave blank for now — step 3 gives you the value* |

5. Deploy. The build runs `bundle install` then `rails db:migrate`.
6. Once it is live, seed the demo data from **Shell** in the Render dashboard:
   ```bash
   bundle exec rails db:seed
   ```
   Run this **once**. The seeds create users idempotently but add fresh posts
   each run, so repeating it just piles up duplicates.
7. Check it: `https://<your-service>.onrender.com/up` should return 200.

Alternatively, `render.yaml` in the repo root declares all of the above as a
Blueprint — **New → Blueprint** will read it, and you then fill in `DATABASE_URL`
and `CORS_ORIGINS` by hand.

## 3. Client — Cloudflare Pages

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com), **Create a project → Connect to Git**,
   pick `mini_twitter`.
2. Build settings:

   | Field | Value |
   |---|---|
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `web` |

3. Environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-service>.onrender.com` |

   This is read at **build** time, not runtime — changing it later needs a redeploy.

4. Deploy. You get a URL like `https://mini-twitter.pages.dev`.

`web/public/_redirects` ships a `/* /index.html 200` rule. Without it, refreshing
`/users/5` returns 404, because the SPA owns its routes and the server knows
nothing about them.

## 4. Close the loop

Go back to Render and set `CORS_ORIGINS` to your Pages URL
(`https://mini-twitter.pages.dev`), then redeploy. Until you do, every request
from the client is blocked by the browser.

Then put the Pages URL in the GitHub repo's **About** box.

---

## Cold starts

Render's free instances sleep after 15 minutes idle, so the **first request
after a quiet spell takes 30–60 seconds**. Neon also scales to zero but wakes in
well under a second.

For a link you are sending to employers that is a poor first impression. Options:

- **Live with it** and say so next to the link: *"hosted free — first load may take ~30s while the server wakes."* Honest, and costs nothing.
- **Render Starter, $7/month**, keeps it always-on. Worth it while you are actively interviewing.

Do not use an external pinger to keep the free instance awake — it burns your
750 monthly hours and Render's terms discourage it.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Build fails on `pg` | `DATABASE_URL` missing at build time — migrations run during build |
| 500s on every request | `SECRET_KEY_BASE` unset |
| Client loads, all API calls fail | `CORS_ORIGINS` does not exactly match the Pages origin — scheme included, no trailing slash |
| 404 when refreshing a sub-page | `_redirects` missing from the build output |
| `PG::ConnectionBad ... SSL` | `?sslmode=require` dropped from the Neon URL |
