.PHONY: up down setup test test-api test-web logs reset lint

up:            ## Start postgres, api and web
	docker compose up -d
	@echo "web http://localhost:5173    api http://localhost:3001"

down:
	docker compose down

setup:         ## Create, migrate and seed the database
	docker compose run --rm api bin/rails db:prepare db:seed

test: test-api test-web

test-api:
	docker compose run --rm -e RAILS_ENV=test api bin/rails test

test-web:
	cd web && npm test

lint:
	cd web && npm run lint

logs:
	docker compose logs -f

reset:         ## Drop and rebuild the database from scratch
	docker compose run --rm api bin/rails db:drop db:create db:migrate db:seed
