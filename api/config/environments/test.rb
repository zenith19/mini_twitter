require 'active_support/core_ext/integer/time'

# The test environment is used exclusively to run the test suite. The test
# database is scratch space: it is wiped and recreated between runs.
Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = ENV['CI'].present?

  config.public_file_server.enabled = true
  config.public_file_server.headers = { 'Cache-Control' => "public, max-age=#{1.hour.to_i}" }

  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  # Render exceptions as the real app would, so tests can assert on status
  # codes (401/404) rather than on raised exceptions.
  config.action_dispatch.show_exceptions = :rescuable

  config.action_controller.allow_forgery_protection = false

  config.active_storage.service = :test

  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :test

  config.active_support.deprecation = :stderr
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []
end
