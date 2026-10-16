# Cross-Origin Resource Sharing.
#
# This was `origins '*'` with every method allowed. Origins now come from the
# CORS_ORIGINS environment variable (comma-separated), defaulting to the Vite
# dev server.
allowed_origins = ENV.fetch('CORS_ORIGINS', 'http://localhost:5173')
                     .split(',')
                     .map(&:strip)
                     .reject(&:empty?)

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource '/v1/*',
             headers: %w[Authorization Content-Type Accept],
             methods: %i[get post put patch delete options head],
             expose: %w[Authorization],
             max_age: 600
  end
end
