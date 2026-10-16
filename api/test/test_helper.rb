ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

module ActiveSupport
  class TestCase
    parallelize(workers: :number_of_processors)
    fixtures :all
  end
end

class ActionDispatch::IntegrationTest
  # Issues a real token for the user and returns the header hash to pass as
  # `headers:`. Mirrors exactly what the client does.
  def auth_headers_for(user)
    token = user.issue_authentication_token!
    { 'Authorization' => "Bearer #{token}" }
  end

  def json_body
    JSON.parse(response.body)
  end
end
