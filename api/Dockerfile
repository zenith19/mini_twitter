# Development image for the Rails API.
FROM ruby:3.2.3-slim

ENV LANG=C.UTF-8 \
    BUNDLE_PATH=/usr/local/bundle \
    RAILS_LOG_TO_STDOUT=true

# build-essential + libpq-dev are needed to compile the pg and bootsnap
# native extensions; postgresql-client gives us psql and pg_isready.
RUN apt-get update -qq \
 && apt-get install --no-install-recommends -y \
      build-essential libpq-dev postgresql-client git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the manifests first so that `bundle install` is cached independently
# of application code changes.
COPY Gemfile Gemfile.lock* ./
RUN gem install bundler -v '~> 2.5' && bundle install

COPY . .

EXPOSE 3001
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "3001"]
