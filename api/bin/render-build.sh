#!/usr/bin/env bash
# Build step for Render. Render's free plan has no pre-deploy hook, so
# migrations run here, after the gems are installed and with DATABASE_URL
# already present in the environment.
set -o errexit

bundle install
bundle exec rails db:migrate
