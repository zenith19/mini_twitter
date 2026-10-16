require_relative 'boot'

require 'rails'
# Only the frameworks this API actually uses. Action Mailbox, Action Text and
# Action Cable were unused generator scaffolding and have been dropped.
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems limited to the
# :test, :development or :production groups.
Bundler.require(*Rails.groups)

module MiniTwitter
  class Application < Rails::Application
    config.load_defaults 7.1

    # Loads the smaller middleware stack suitable for an API-only app: no
    # sessions, flash, cookies, views or assets.
    config.api_only = true

    # app/controllers/concerns is on the autoload path by default; this keeps
    # lib/ available for plain service objects without eager-loading tasks.
    config.autoload_lib(ignore: %w[assets tasks])
  end
end
