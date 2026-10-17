# api — mini twitter backend

Rails 7.1 API-only backend on Ruby 3.2 and PostgreSQL. See the [root README](../README.md) for the
architecture, the endpoint table and the auth design.

## Layout

| Path | What lives there |
|---|---|
| `app/controllers/concerns/authenticatable.rb` | Token auth: `authenticate_user!`, `current_user` |
| `app/controllers/application_controller.rb` | Error rendering (404/422), shared pagination |
| `app/controllers/v1/` | The versioned endpoints |
| `app/models/` | `User`, `Post`, `Comment`, `UserFollowing` |
| `app/serializers/` | Active Model Serializers; `UserSerializer` gates email visibility |
| `config/initializers/rack_attack.rb` | Login / signup / global throttles |

## Commands

```bash
bin/setup                       # install, create .env, prepare the database
bin/rails server -p 3001
bin/rails test                  # 79 runs
bin/rails db:seed               # 8 users with posts, comments and follows
```

Run them through Docker with `docker compose run --rm api <command>`.

## Configuration

Everything comes from the environment; see [.env.example](.env.example).

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_HOST` / `_PORT` / `_USERNAME` / `_PASSWORD` / `_NAME` | localhost:5432 | Development and test |
| `DATABASE_URL` | — | Preferred in production |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `SECRET_KEY_BASE` | — | Required in production |

## Notes

- Tests run single-threaded in CI; `parallelize` is on by default locally.
- `minitest` is pinned to 5.x — minitest 6 changed `Minitest::Runnable.run` and is incompatible
  with the Rails 7.1 test runner.
- Devise supplies password hashing and validations only; session handling is in
  `Authenticatable` and `User#issue_authentication_token!`.
